import { min } from "@perp/common/build/lib/bn"
import { priceToTick, sleep, tickToPrice } from "@perp/common/build/lib/helper"
import { Log } from "@perp/common/build/lib/loggers"
import { BotService } from "@perp/common/build/lib/perp/BotService"
import { AmountType, OpenOrder, Side } from '@perp/common/build/lib/perp/PerpService'
import Big from "big.js"
import { ethers } from "ethers"
import { Service } from "typedi"

import { ErrorLogData, HistoryLog, LiquidityBotConfig, LogData, Market } from '../common/types'

@Service()
export class Maker extends BotService {
    public active = false
    public config?: LiquidityBotConfig
    public logsHistory: Array<HistoryLog> = []
    readonly log = Log.getLogger(Maker.name)

    private wallet!: ethers.Wallet
    private marketMap: { [key: string]: Market } = {}
    private marketOrderMap: { [key: string]: OpenOrder&{entryPrice?: Big} } = {}

    setConfig = (config: LiquidityBotConfig) => {
        this.config = config
    }

    async setup(): Promise<void> {
        if (!this.config) {
            this.log.jinfo({ event: "Error", params: { message: "Please provide config" } })
            return;
        }

        this.logInfo({
            event: "SetupMaker",
        })

        const privateKey = this.config.privateKey

        if (!privateKey) {
            throw Error("no env PRIVATE_KEY is provided")
        }

        this.wallet = this.ethService.privateKeyToWallet(privateKey)
        await this.createNonceMutex([this.wallet])
        await this.createMarketMap()

        this.logInfo({
            event: "Maker",
            params: {
                address: this.wallet.address,
                nextNonce: this.addrNonceMutexMap[this.wallet.address].nextNonce,
            },
        })
    }

    async createMarketMap() {
        const poolMap: { [keys: string]: any } = {}
        for (const pool of this.perpService.metadata.pools) {
            poolMap[pool.baseSymbol] = pool
        }

        for (const [marketName, market] of Object.entries(this.config!.marketMap)) {
            if (!market.isEnabled) {
                continue
            }
            const pool = poolMap[marketName]
            this.marketMap[marketName] = {
                name: marketName,
                baseToken: pool.baseAddress,
                poolAddr: pool.address,
                tickSpacing: await this.perpService.getTickSpacing(pool.address),
                liquidityAmount: Big(market.liquidityAmount),
                liquidityRangeMultiplier: Big(market.liquidityRangeOffset).add(1),
                liquidityAdjustMultiplier: Big(market.liquidityAdjustThreshold).add(1),
                imbalanceStartTime: null
            }
        }
    }

    async start(): Promise<void> {
        if (!this.config) {
            this.logInfo({ event: "Error", params: { message: "Please provide config" } })
            return;
        }

        const balance = await this.perpService.getUSDCBalance(this.wallet.address)

        this.logInfo({ event: "CheckUSDCBalance", params: { balance: +balance } })

        if (balance.gt(0)) {
            await this.approve(this.wallet, balance)
            await this.deposit(this.wallet, balance)
        }

        this.active = true
        await this.makerRoutine()
    }

    async stop(): Promise<void> {
        this.logInfo({ event: "Stop Maker Routine started", params: {} })

        this.active = false

        for (const market of Object.values(this.marketMap)) {
            this.logInfo({ event: "Stop token maker ", params: { token: market.baseToken } })

            await this.reducePosition(market)
            const order = this.marketOrderMap[market.name]
            await this.removeOrder(market, order)

            this.logInfo({ event: "Stop token completed ", params: { token: market.baseToken } })
        }

        this.logInfo({ event: "Stop Maker Routine completed", params: {} })
    }

    async makerRoutine() {
        while (this.active) {
            // TODO: use Promise.all()
            for (const market of Object.values(this.marketMap)) {
                try {
                    const gasPrice = await this.ethService.getGasPrice()
                    const adjustMaxGasPrice = Big(this.config!.adjustMaxGasPriceGwei)
                    if (gasPrice.gt(adjustMaxGasPrice)) {
                        this.logWarn({
                            event: "GasPriceExceed",
                            params: { gasPrice: +gasPrice, maxGasPrice: +adjustMaxGasPrice },
                        })

                        continue
                    }

                    await this.refreshOrders(market)
                    await this.adjustLiquidity(market)
                    await this.hedge(market)
                } catch (err: any) {
                    await this.log.jerror({
                        event: "AdjustLiquidityError",
                        params: { err: err.toString() },
                    })
                }
            }

            await sleep(this.config!.priceCheckInterval * 1000)
        }
    }

    async hedge(market: Market) {
        if (!this.config?.adjustMaxGasPriceGwei) {
            return;
        }

        const now = Date.now();

        if (market.imbalanceStartTime === null) {
            market.imbalanceStartTime = now
        }

        const marketPrice = await this.perpService.getMarketPrice(market.poolAddr)
        const order = this.marketOrderMap[market.name]

        if (!order.entryPrice) {
            await this.logError({
                event: "NoEntryPriceError",
                params: { err: null },
            })
            return;
        }

        // (marketprice - entryPrice)/((marketPrice+entryPrice)/2)
        const diff = marketPrice.minus(order.entryPrice).div(order.entryPrice).abs();

        // @ts-ignore
        if (diff.gte(this.config.marketMap[market.name].hedgeActivationDiff)) {
            const positionValue = await this.perpService.getTotalPositionValue(this.wallet.address, market.baseToken);
            if (+positionValue !== 0) {
                return;
            }

            const side = marketPrice.gt(order.entryPrice) ? Side.LONG : Side.SHORT

            if (+order.baseDebt === 0) {
                await this.logError({
                    event: "NoBaseDebtError",
                    params: { err: null },
                })
                return;
            }

            this.logInfo({
                event: "Open futures position",
                params: {
                    market: market.name,
                    marketPrice,
                    liquidityAmount: market.liquidityAmount,
                    value: Big(market.liquidityAmount).div(marketPrice),
                    side: side,
                },
            })

            await this.openPosition(
                this.wallet,
                market.baseToken,
                side,
                AmountType.QUOTE,
                market.liquidityAmount,
                undefined,
                Big(this.config?.adjustMaxGasPriceGwei),
            )
        } else {
            const positionValue = await this.perpService.getTotalPositionValue(this.wallet.address, market.baseToken);
            if (+positionValue !== 0) {
                return;
            }
            await this.reducePosition(market)
        }
    }

    async reducePosition(market: Market) {
        const positionValue = await this.perpService.getTotalPositionValue(this.wallet.address, market.baseToken)

        this.logInfo({
            event: "Reduce futures position",
            params: {
                market: market.name,
                positionValue: +positionValue
            },
        })

        await this.closePosition(this.wallet, market.baseToken)
    }

    async refreshOrders(market: Market) {
        const openOrders = await this.perpService.getOpenOrders(this.wallet.address, market.baseToken)
        if (openOrders.length > 1) {
            throw Error("account has more than 1 orders")
        }

        for (const openOrder of openOrders) {
            this.logInfo({
                event: "GetOpenOrders",
                params: {
                    market: market.name,
                    lowerPrice: tickToPrice(openOrder.lowerTick),
                    upperPrice: tickToPrice(openOrder.upperTick),
                },
            })
        }

        switch (openOrders.length) {
            case 0: {
                this.logInfo({
                    event: "Create new Order",
                    params: {
                        market: market.name,
                    },
                })
                this.marketOrderMap[market.name] = await this.createOrder(market)
                break
            }
            case 1: {
                this.logInfo({
                    event: "Update order",
                    params: {
                        market: market.name,
                    },
                })
                const marketPrice = this.marketOrderMap[market.name].entryPrice;
                this.marketOrderMap[market.name] = { ...openOrders[0], entryPrice: marketPrice }
                break
            }
            default: {
                // abnormal case, remove all orders manually
                await this.logError({
                    event: "RefreshOrderError",
                    params: { err: new Error("RefreshOrderError"), openOrders },
                })
                //await Promise.all(orders.map(order => this.removeOrder(market, order)))
                process.exit(0)
            }
        }
    }

    async isValidOrder(market: Market, openOrder: OpenOrder): Promise<boolean> {
        const marketPrice = await this.perpService.getMarketPrice(market.poolAddr)
        const upperPrice = tickToPrice(openOrder.upperTick)
        const lowerPrice = tickToPrice(openOrder.lowerTick)
        const centralPrice = upperPrice.mul(lowerPrice).sqrt()
        const upperAdjustPrice = centralPrice.mul(market.liquidityAdjustMultiplier)
        const lowerAdjustPrice = centralPrice.div(market.liquidityAdjustMultiplier)

        return marketPrice.gt(lowerAdjustPrice) && marketPrice.lt(upperAdjustPrice)
    }

    async createOrder(market: Market): Promise<OpenOrder&{entryPrice:Big}> {
        const buyingPower = await this.perpService.getBuyingPower(this.wallet.address)
        const liquidityAmount = min([market.liquidityAmount, buyingPower])
        if (liquidityAmount.lte(0)) {
            this.logWarn({
                event: "NoBuyingPowerToCreateOrder",
                params: {
                    market: market.name,
                    buyingPower: +buyingPower,
                },
            })

            throw Error("NoBuyingPowerToCreateOrder")
        }

        const marketPrice = await this.perpService.getMarketPrice(market.poolAddr)
        const upperPrice = marketPrice.mul(market.liquidityRangeMultiplier)
        const lowerPrice = marketPrice.div(market.liquidityRangeMultiplier)
        const upperTick = priceToTick(upperPrice, market.tickSpacing)
        const lowerTick = priceToTick(lowerPrice, market.tickSpacing)

        this.logInfo({
            event: "CreateOrder",
            params: {
                market: market.name,
                marketPrice: +marketPrice,
                upperPrice: +upperPrice,
                lowerPrice: +lowerPrice,
                upperTick,
                lowerTick,
            },
        })
        const quote = liquidityAmount.div(2)
        const base = liquidityAmount.div(2).div(marketPrice)

        await this.addLiquidity(this.wallet, market.baseToken, lowerTick, upperTick, base, quote, false)

        const newOpenOrder = await this.perpService.getOpenOrder(
            this.wallet.address,
            market.baseToken,
            lowerTick,
            upperTick,
        )

        return {
            upperTick: upperTick,
            lowerTick: lowerTick,
            liquidity: newOpenOrder.liquidity,
            baseDebt: newOpenOrder.baseDebt,
            quoteDebt: newOpenOrder.quoteDebt,
            entryPrice: marketPrice,
        }
    }

    async removeOrder(market: Market, openOrder: OpenOrder): Promise<void> {
        this.logInfo({
            event: "RemoveOrder",
            params: {
                market: market.name,
                upperPrice: +tickToPrice(openOrder.upperTick),
                lowerPrice: +tickToPrice(openOrder.lowerTick),
            },
        })
        await this.removeLiquidity(
            this.wallet,
            market.baseToken,
            openOrder.lowerTick,
            openOrder.upperTick,
            openOrder.liquidity,
        )

        await this.closePosition(this.wallet, market.baseToken)
    }

    async adjustLiquidity(market: Market): Promise<void> {
        const order = this.marketOrderMap[market.name]
        this.logInfo({
            event: "AdjustOrder",
            params: {
                market: market.name,
                upperPrice: +tickToPrice(order.upperTick),
                lowerPrice: +tickToPrice(order.lowerTick),
            },
        })

        if (!(await this.isValidOrder(market, order))) {
            await this.removeOrder(market, order)
            const newOpenOrder = await this.createOrder(market)

            this.marketOrderMap[market.name] = newOpenOrder
        }
    }

    logError = (logErrorData: ErrorLogData) => {
        this.logsHistory.unshift({
            date: new Date(),
            data: logErrorData,
        })

        return this.log.jerror(logErrorData)
    }

    logInfo = (logData: LogData) => {
        this.logsHistory.unshift({
            date: new Date(),
            data: logData,
        })

        return this.log.jinfo(logData)
    }

    logWarn = (logData: LogData) => {
        this.logsHistory.unshift({
            date: new Date(),
            data: logData,
        })

        return this.log.jwarn(logData)
    }
}
