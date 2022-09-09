// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { uid } from 'uid'
import { activeMakers, startLiquidityBot } from '../../../maker'

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
    const id = uid(10);

    console.log(JSON.parse(req.body))

    startLiquidityBot(JSON.parse(req.body), id)

    res.status(200).json(
        {
          success: true,
          data: {
            id,
          }
        }
    )

    return;
  }

  if (req.method === "GET") {
    const makers = Array.from(activeMakers.keys())
    
    let markets = null;

    const response = makers.map((maker_uid, index) => {
      const makerInstance = activeMakers.get(maker_uid)
      
      if (index === 0) {
        markets = makerInstance?.marketMap;
      }

      if (!makerInstance) {
        return;
      }
      const key = Object.keys(makerInstance.marketMap)[index];
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
