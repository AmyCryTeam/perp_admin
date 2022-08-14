import type { NextApiRequest, NextApiResponse } from 'next'
import { activeMakers } from '../../../../maker'

type Data = {
    success: boolean,
    data?: any
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "GET") {
        const botId = req.query.id

        if (!botId || typeof botId !== 'string') {
            res.status(400).json({ success: false, error: "Id not found" })
            return;
        }

        const maker = activeMakers.get(botId)

        if (!maker) {
            res.status(400).json({ success: false, error: "bot not found" })
            return;
        }

        res.status(200).json({ success: true, data: maker.logsHistory })
        return;
    }

}
