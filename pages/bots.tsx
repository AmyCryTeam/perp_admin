//@ts-nocheck
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Header } from '../components/Header/Header'

const Bots: NextPage = () => {
    const [bots, setBots] = useState([]);

    const checkBots = () => {
        fetch("/api/bot")
            .then(res => res.json())
            .then(({ data }) => {
                setBots(data)
            }).then(() => {
            setTimeout(() => {
                checkBots()
            }, 2000)
        })
    }

    console.log(bots)

    useEffect(() => {
        checkBots()
    }, [])

    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Col>
                        <table className="table table-dark">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">uid</th>
                                <th scope="col">Config</th>
                                <th scope="col">Active</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bots.map((bot, index) => {
                                return (
                                    <tr key={bot.id}>
                                        <th scope="row">{index}</th>
                                        <td>{bot.id}</td>
                                        <td>{JSON.stringify(bot.config)}</td>
                                        <td>{bot.status ? "Active" : "Disabled"}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Bots
