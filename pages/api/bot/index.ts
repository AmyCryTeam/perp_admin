// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { uid } from 'uid'
import { activeMakers, startLiquidityBot } from '../../../maker'

type Data = {
  success: boolean,
  data?: any
  error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  if (req.method === "POST") {

      try {
          const id = uid(10);
          console.log(JSON.parse(req.body))

          const result = await startLiquidityBot(JSON.parse(req.body), id);
          result.start();

          return res.status(200).json(
              {
                  success: true,
                  data: {
                      id,
                  }
              }
          )
      } catch (error) {
          return res.status(500).json(
              {
                  success: false,
                  data: {
                      error,
                  }
              }
          )
      }
  }

  if (req.method === "GET") {
    const makers = Array.from(activeMakers.keys())

    const response = makers.map((maker_uid, index) => {
      const makerInstance = activeMakers.get(maker_uid)

      if (!makerInstance) {
        return;
      }
      const key = Object.keys(makerInstance.marketMap)[0];
      return ({
        id: maker_uid,
        status: makerInstance.active,
        config: makerInstance.marketMap[key]
      })
    }).filter(Boolean)

    res.status(200).json({ success: true, data: response })
    return;
  }

}
