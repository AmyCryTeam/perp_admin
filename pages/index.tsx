import type { NextPage } from 'next'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Header } from '../components/Header/Header'

/*
"PRICE_CHECK_INTERVAL_SEC": 5,
    "ADJUST_MAX_GAS_PRICE_GWEI": 500,
    "MARKET_MAP": {
        "vBTC": {
            "IS_ENABLED": true,
            "LIQUIDITY_AMOUNT": 2000,
            "LIQUIDITY_RANGE_OFFSET": 0.5,
            "LIQUIDITY_ADJUST_THRESHOLD": 1
        },
        "vPERP": {
            "IS_ENABLED": true,
            "LIQUIDITY_AMOUNT": 2000,
            "LIQUIDITY_RANGE_OFFSET": 0.5,
            "LIQUIDITY_ADJUST_THRESHOLD": 1
        }
    }
* */

const Home: NextPage = () => {
    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Col
                        xs={12}
                        md={{ span: 8, offset: 2 }}
                        xl={{ span: 4, offset: 4 }}
                    >
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Price check interval (sec)</Form.Label>
                                <Form.Control
                                    min={0}
                                    type="number"
                                    placeholder="Interval"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Pair</Form.Label>
                                <Form.Select>
                                    <option>vBTC</option>
                                    <option>vPERP</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Max gas price (gwey)</Form.Label>
                                <Form.Control type="number" min={0} placeholder="Gas price" />
                            </Form.Group>
                            {/*<Form.Group>*/}
                            {/*    <Form.Check id="Check" label="Auto" />*/}
                            {/*</Form.Group>*/}
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Liquidity amount</Form.Label>
                                <Form.Control type="number" min={0} placeholder="Amount" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Liquidity range offset</Form.Label>
                                <Form.Control type="number" min={0} placeholder="Offset" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Liquidity adjust threshold</Form.Label>
                                <Form.Control type="number" min={0} placeholder="Threshold" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Provide liquidity
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
