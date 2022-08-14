import { useEffect, useRef, useState } from 'react'
import { Badge, Button, Col, Container, Row, Table } from 'react-bootstrap'
import { LiquidityBotData } from '../../../common/types'
import { TableControls } from './components/TableControls/TableControls'

const REFETCH_TIMEOUT = 2000;

export const BotsPageContent = () => {
    const [bots, setBots] = useState<LiquidityBotData[]>([]);

    const checkBots = () => {
        fetch("/api/bot")
            .then(res => res.json())
            .then(({ data }) => {
                setBots(data)

                setTimeout(() => {
                    checkBots()
                }, REFETCH_TIMEOUT)
            })
    }

    useEffect(() => {
        checkBots()
    }, [])

    return (
        <Container>
            <Row>
                {bots.length > 0
                    ? (
                        <Col md={12} xl={{span: 10, offset: 1}}>
                            <Table hover variant="dark" responsive>
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
                        </Col>
                    )
                    : (
                        <div>
                            <h3>
                                List is Empty
                            </h3>
                            <Button variant="outline-success" href="/">Add Bot</Button>
                        </div>
                    )
                }
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
