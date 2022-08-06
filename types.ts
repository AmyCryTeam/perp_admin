import Big from 'big.js'

export interface Market {
    name: string
    baseToken: string
    poolAddr: string
    tickSpacing: number
    // config
    // maker
    liquidityAmount: Big
    liquidityRangeMultiplier: Big
    liquidityAdjustMultiplier: Big
}

const enum AvailablePairs {
    vBTC = "vBTC",
    vPERP = "vPERP",
}

interface PairConfig {
    "isEnabled": boolean,
    "liquidityAmount": number,
    "liquidityRangeOffset": number,
    "liquidityAdjustThreshold": number
}

export interface LiquidityBotConfig {
    privateKey: string,
    priceCheckInterval: number,
    adjustMaxGasPriceGwei: number,
    marketMap: Record<keyof AvailablePairs, PairConfig>
}
