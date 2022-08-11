import styles from './HomePage.module.scss'
import { FormEventHandler, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { LiquidityBotConfig } from '../../../common/types'

export const HomePageContent = () => {
    const [loading, setIsLoading] = useState(false)

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const config: LiquidityBotConfig = {
            //@ts-ignore
            privateKey: e.target?.private_key.value,
            //@ts-ignore
            priceCheckInterval: e.target?.price_check_interval.value,
            //@ts-ignore
            adjustMaxGasPriceGwei: e.target?.max_gas_price.value,
            //@ts-ignore
            marketMap: {
                //@ts-ignore
                [e.target?.pair_name.value]: {
                    isEnabled: true,
                    //@ts-ignore
                    liquidityAmount: e.target?.liquidity_amount.value,
                    //@ts-ignore
                    liquidityRangeOffset: e.target?.liquidity_range.value,
                    //@ts-ignore
                    liquidityAdjustThreshold: e.target?.liquidity_threshold.value,
                }
            }
        }

        setIsLoading(true);

        fetch('/api/bot', {
            method: 'POST',
            body: JSON.stringify(config)
        }).then(() => {
            setIsLoading(false)
        })
    }

    return (
        <Container>
            <Row>
                <Col
                    xs={12}
                    md={{ span: 8, offset: 2 }}
                    xl={{ span: 4, offset: 4 }}
                >
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="private_key">
                            <Form.Label>Private key</Form.Label>
                            <Form.Control
                                required
                                min={0}
                                type="string"
                                name="private_key"
                                placeholder="#00000000000000000000000000000000"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price_check_interval">
                            <Form.Label>Price check interval</Form.Label>
                            <Form.Control
                                required
                                min={0}
                                type="number"
                                name="price_check_interval"
                                placeholder="100 sec"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="pair_name">
                            <Form.Label>Pair</Form.Label>
                            <Form.Select required name="pair_name">
                                <option>vBTC</option>
                                <option>vPERP</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="max_gas_price">
                            <Form.Label>Max gas price</Form.Label>
                            <Form.Control
                                required
                                min={0}
                                type="number"
                                placeholder="200 gwey"
                                name="gas_price"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="liquidity_amount">
                            <Form.Label>Liquidity amount</Form.Label>
                            <Form.Control
                                required
                                min={0}
                                type="number"
                                placeholder="2000 usdc"
                                name="liquidity_amount"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="liquidity_range">
                            <Form.Label>Liquidity range offset</Form.Label>
                            <Form.Control
                                required
                                step="0.01"
                                min={0}
                                type="number"
                                placeholder="0.4"
                                name="liquidity_range"
                            />
                            <small id="liquidity_range_help" className="form-text text-muted">
                                [current_price / (1 + offset), current price * (1 + offset)]
                            </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="liquidity_threshold">
                            <Form.Label>Liquidity adjust threshold</Form.Label>
                            <Form.Control
                                required
                                step="0.01"
                                min={0}
                                type="number"
                                name="liquidity_threshold"
                                placeholder="Threshold"
                            />
                            <small id="liquidity_range_help" className="form-text text-muted">
                                [market price / (1 + treshold), market price * (1 + treshold)]
                            </small>
                        </Form.Group>
                        <Button disabled={loading} variant="primary" type="submit">
                            {
                                loading
                                    ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="sr-only">Loading...</span>
                                        </>
                                    )
                                    : "Provide liquidity"
                            }
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
