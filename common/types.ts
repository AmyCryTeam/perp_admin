import Big from 'big.js'

export interface Market {
    name: string
    baseToken: string
    poolAddr: string
    tickSpacing: number
    imbalanceStartTime: number | null
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
    isEnabled: boolean,
    liquidityAmount: number,
    liquidityRangeOffset: number,
    hedgeActivationDiff: number,
    liquidityAdjustThreshold: number,
    hedgeVolume: number,
    hedgeLiquidationLong: number,
    hedgeLiquidationShort: number,
}

interface FuturesConfig {
    minPrice: number,
    maxPrice: number,
}

export interface LiquidityBotConfig {
    privateKey: string,
    name: string,
    liquidityAmount: string,
    priceCheckInterval: number,
    adjustMaxGasPriceGwei: number,
    marketMap: Record<keyof AvailablePairs, PairConfig>
    futuresMap: Record<keyof AvailablePairs, FuturesConfig> | {}
}

export interface LiquidityBotData {
    id: string,
    status: "Active" | "Disabled",
    config: LiquidityBotConfig,
    configBot: PairConfig
}

export interface LogData {
    event: string;
    params?: {
        [key: string]: any;
    };
}

export interface ErrorLogData extends LogData {
    params: {
        err: any;
        [key: string]: any;
    };
}

export type HistoryLog = {
    date: Date,
    data: LogData | ErrorLogData
}
