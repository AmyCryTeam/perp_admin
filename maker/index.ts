import "reflect-metadata"
import dotenv from "dotenv"
import { Log, initLog } from "@perp/common/build/lib/loggers"
import { Container } from "typedi"
import { uid } from 'uid';
import { LiquidityBotConfig } from '../types'

import { Maker } from "./Maker"

dotenv.config();
initLog()

export async function startLiquidityBot(config: LiquidityBotConfig): Promise<void> {
    // process.env["STAGE"] = "production"
    // process.env["NETWORK"] = "optimism"

    // crash fast on uncaught errors
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

    const maker = Container.get(Maker)
    maker.setConfig(config)
    await maker.setup()
    activeMakers.set(uid(10), maker)
    await maker.start()
}


export const activeMakers = new Map<string, Maker>()
