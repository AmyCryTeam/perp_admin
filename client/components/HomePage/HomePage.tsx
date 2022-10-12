import { useRouter } from 'next/router'
import { FormEventHandler, useState } from 'react'
import { Button, Col, Container, Form, ListGroup, Modal, Row, Stack } from 'react-bootstrap'
import styles from './HomePage.module.scss'
import { LiquidityBotConfig } from '../../../common/types'

const MARKET_PAIRS = [
    'vBTC',
    'vPERP',
    'vAAVE',
    'vAVAX',
    'vBNB',
    'vCRV',
    'vETH',
    'vFLOW',
    'vFTM',
    'vLINK',
    'vMATIC',
    'vNEAR',
    'vONE',
    'vSAND',
    'vSOL',
]

export const HomePageContent = () => {
    const [loading, setIsLoading] = useState(false);
    const router = useRouter();
    // TODO(Dimitreee): move to modal context
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


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
                    //@ts-ignore
                    hedgeActivationDiff: e.target?.hedge_activation_diff.value,
                    //@ts-ignore
                    hedgeVolume: e.target?.hedge_volume.value,
                    //@ts-ignore
                    hedgeLiquidationLong: e.target?.hedge_liquidation_long.value,
                    //@ts-ignore
                    hedgeLiquidationShort: e.target?.hedge_liquidation_short.value,
                }
            }
        }

        setIsLoading(true);

        fetch('/api/bot', {
            method: 'POST',
            body: JSON.stringify(config)
        })
            .then((res) => res.json())
            .then(() => {
                setIsLoading(false)
                router.push('/bots')
            })
    }

    return (
        <Container>
            <Row>
                <Col
                    xs={12}
                    md={{ span: 10, offset: 1 }}
                    xl={{ span: 6, offset: 3 }}
                >
                    <Form onSubmit={handleSubmit}>
                        <Form.Text>
                            <h4>
                                Account
                            </h4>
                        </Form.Text>
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
                        <Form.Text>
                            <h4>
                                Liquidity
                            </h4>
                        </Form.Text>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="pair_name">
                                <Form.Label>Pair</Form.Label>
                                <Form.Select required name="pair_name">
                                    {MARKET_PAIRS.map((pair) => {
                                        return (
                                            <option key={pair}>{pair}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId="liquidity_amount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    required
                                    min={0}
                                    type="number"
                                    placeholder="2000 usdc"
                                    name="liquidity_amount"
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="max_gas_price">
                                <Form.Label>Max gas price</Form.Label>
                                <Form.Control
                                    required
                                    min={0}
                                    type="number"
                                    placeholder="200 gwey"
                                    name="gas_price"
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="liquidity_range">
                                <Form.Label>Range</Form.Label>
                                <Form.Control
                                    required
                                    step="0.001"
                                    min={0}
                                    type="number"
                                    placeholder="0.4"
                                    name="liquidity_range"
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} controlId="price_check_interval">
                                <Form.Label>Price check interval</Form.Label>
                                <Form.Control
                                    required
                                    min={0}
                                    type="number"
                                    name="price_check_interval"
                                    placeholder="100 sec"
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="liquidity_threshold">
                                <Form.Label>Liquidity adjust threshold</Form.Label>
                                <Form.Control
                                    required
                                    step="0.001"
                                    min={0}
                                    type="number"
                                    name="liquidity_threshold"
                                    placeholder="Threshold"
                                />
                                <small id="liquidity_range_help" className="form-text text-muted">
                                    [market price / (1 + treshold), market price * (1 + treshold)]
                                </small>
                            </Form.Group>
                        </Row>
                        <Form.Text>
                            <h4>
                                Futures
                            </h4>
                        </Form.Text>
                        <Row>
                            <Form.Group className="mb-3" controlId="hedge_price_range">
                                <Form.Label>Hedge activation offset</Form.Label>
                                <Form.Control
                                    required
                                    step="0.001"
                                    min={0}
                                    type="number"
                                    name="hedge_activation_diff"
                                    placeholder="Threshold"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="hedge_volume">
                                <Form.Label>Hedge position volume</Form.Label>
                                <Form.Control
                                    required
                                    step="0.001"
                                    min={0}
                                    type="number"
                                    name="hedge_volume"
                                    placeholder="1"
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="hedge_liquidation_long">
                                <Form.Label>Hedge liquidation Long</Form.Label>
                                <Form.Control
                                    required
                                    step="0.001"
                                    type="number"
                                    name="hedge_liquidation_long"
                                    placeholder="-0.04"
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="hedge_liquidation_short">
                                <Form.Label>Hedge liquidation Short</Form.Label>
                                <Form.Control
                                    required
                                    step="0.001"
                                    type="number"
                                    name="hedge_liquidation_short"
                                    placeholder="0.04"
                                />
                            </Form.Group>
                        </Row>
                        <Stack direction="horizontal" gap={3}>
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
                            <Button variant="secondary" onClick={handleShow}>
                                Show Legend
                            </Button>
                        </Stack>
                    </Form>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} className={styles.legendModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3>
                            Расшифровка аббревиатур
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Modal.Body>
                    <ListGroup as="ol" numbered>
                        <ListGroup.Item as="li"><b>Private key</b> - приватный ключ кошелька для предоставления ликвидности</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Pair</b> - валютная пара по которой будет предоставляться ликвидность <b>USDC-v*</b></ListGroup.Item>
                        <ListGroup.Item as="li"><b>Amount</b> - Объём позиции для пула ликвидности</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Max gas price</b> - Максимальная цена одной транзакции для всех сделок</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Range</b> - Выбор диапазона цены в % от текущей цены для позиции в пуле ликвидности, будущий диапазон расчитывается как <b>[market price / (1 + range), market price * (1 + range)]</b></ListGroup.Item>
                        <ListGroup.Item as="li"><b>Price check interval</b> - интервал проверки цены и логирования</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Liquidity adjust threshold</b> - шаг проскальзывания цены в % от текущей цены</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Hedge activation offset</b> - Выбор диапазона цены в % от цены входа при которой открывается хэдж позиция</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Hedge position volume</b> - объем для выставляемых позиций в % от объема позиции в пуле ликвидности</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Hedge liquidation</b> -  % изменения от цены выставления фьючерса, при котором позиция должна быть закрыта, <b>bot</b> и <b>top</b> соответственно</ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
