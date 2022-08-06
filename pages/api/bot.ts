// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { activeMakers, startLiquidityBot } from '../../maker'

type Data = {
  success: boolean,
  data?: any
  error?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method === "POST") {
    startLiquidityBot(JSON.parse(req.body))
    res.status(200).json({ success: true })
    return;
  }

  if (req.method === "GET") {

    const makers = Array.from(activeMakers.keys())
    console.log(activeMakers)

    const response = makers.map((maker_uid) => {
      const makerInstance = activeMakers.get(maker_uid)

      if (!makerInstance) {
        return;
      }

      return ({
        id: maker_uid,
        status: makerInstance.active,
        config: makerInstance.config
      })
    }).filter(Boolean)

    res.status(200).json({ success: true, data: response })
    return;
  }

}
