import { useEffect, useState } from 'react'
import { Badge, Col, Container, Row, Table } from 'react-bootstrap'
import { LiquidityBotData } from '../../../common/types'
import { TableControls } from './components/TableControls/TableControls'

export const BotsPageContent = () => {
    const [bots, setBots] = useState<LiquidityBotData[]>([]);

    const checkBots = () => {
        fetch("/api/bot")
            .then(res => res.json())
            .then(({ data }) => {
                setBots(data)
            })
    }

    useEffect(() => {
        checkBots()
    }, [])

    return (
        <Container>
            <Row>
                <Col md={12} xl={{span: 8, offset: 2}}>
                    <div className="table-responsive" >
                        <Table hover variant="dark">
                            <thead>
                                <tr>
                                    <th scope="col">Pairs</th>
                                    <th scope="col">Total liquidity</th>
                                    <th scope="col"> </th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                bots.map((bot) => {
                                    return (
                                        <tr key={bot.id}>
                                            <th scope="row">
                                                {Object.keys(bot.config.marketMap).join(", ")}
                                                &nbsp;&nbsp;&nbsp;
                                                {
                                                    bot.status
                                                        ? <Badge bg="success">Active</Badge>
                                                        : <Badge bg="secondary">Disabled</Badge>
                                                }
                                            </th>
                                            <td>{getLiquidityFromBot(bot)}</td>
                                            <td>
                                                <TableControls botData={bot} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

const getLiquidityFromBot = (botData: LiquidityBotData) => {
    return (
        Object.values(botData.config.marketMap).reduce((summ, botConfig) => {
            return summ += Number(botConfig.liquidityAmount)
        }, 0)
    )
}
