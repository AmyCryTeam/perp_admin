import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Button, Container, ListGroup, Row, Table } from 'react-bootstrap'
import { HistoryLog } from '../../../common/types'

const REFETCH_TIMEOUT = 2000;

export const LogsPageContent = () => {
    const router = useRouter()
    const { botId } = router.query
    const [logs, setLogs] = useState<HistoryLog[]>([]);

    const checkLogs = () => {
        fetch(`/api/bot/${botId}/logs`)
            .then((res) => res.json())
            .then((payload) => {
                console.log(payload)
                if (payload.success) {
                    setLogs(payload.data || [])
                }

                setTimeout(() => {
                    checkLogs()
                }, REFETCH_TIMEOUT)
            })
    }

    useEffect(() => {
        if (!botId) {
            return;
        }

        checkLogs()
    }, [botId])

    return (
        <Container>
            <Row>
                {logs.length > 0
                    ? (
                        <Table striped bordered hover variant="dark">
                            <thead>
                            <tr>
                                <th>date</th>
                                <th>Event name</th>
                                <th>params</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                logs.map((log, i) => {
                                    return (
                                        // @ts-ignore
                                        <tr key={log.date + i}>
                                            <td>
                                                {
                                                    new Date(log.date).toLocaleString(
                                                        'ru-RU',
                                                        {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            second: 'numeric',
                                                        })
                                                }
                                            </td>
                                            <td>{log.data.event}</td>
                                            <td>
                                                {
                                                    log.data.params && (
                                                        <ListGroup>
                                                            {
                                                                Object.entries(log.data.params).map(([name, value], index) => {
                                                                    return (
                                                                        // @ts-ignore
                                                                        <ListGroup.Item key={index}>{name}: {value}</ListGroup.Item>
                                                                    )
                                                                })
                                                            }
                                                        </ListGroup>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    )
                    : (
                        <div>
                            <h3>
                                Bot is not exists
                            </h3>
                            <Button variant="outline-success" href="/">Add Bot</Button>
                        </div>
                    )
                }
            </Row>
        </Container>
    )
}

