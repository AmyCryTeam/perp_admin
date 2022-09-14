import "reflect-metadata"
import "dotenv-flow/config"
import { Log, initLog } from "@perp/common/build/lib/loggers"
import { Container } from "typedi"
import { uid } from 'uid';
import { LiquidityBotConfig } from '../common/types'

import { Maker } from "./Maker"
initLog()

export async function startLiquidityBot(config: LiquidityBotConfig, id: string = uid(10)): Promise<Maker> {
    console.log('process.env.!!!!!!!!!!!!!!!!', process.env.L2_WEB3_ENDPOINTS)
    
    // process.env["STAGE"] = "production"
    // process.env["NETWORK"] = "optimism"
    const exitUncaughtError = async (err: any): Promise<void> => {
        const log = Log.getLogger("startLiquidityBot")

        try {
            await log.jerror({
                event: "UncaughtException",
                params: {
                    err,
                },
            })
        } catch (e: any) {
            console.log("exitUncaughtError error" + e.toString())
        }

        process.exit(1)
    }

    process.on("uncaughtException", err => exitUncaughtError(err))
    process.on("unhandledRejection", reason => exitUncaughtError(reason))

    const maker = new Maker(config);

    await maker.setup()
    activeMakers.set(id, maker);

    return maker;
}

export const activeMakers = new Map<string, Maker>()