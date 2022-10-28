import React, { useState } from 'react'
import { Button, Stack, Modal } from 'react-bootstrap'
import { Printer, SquareFill, XLg, CaretRightFill, ExclamationOctagon } from 'react-bootstrap-icons'
import { LiquidityBotData } from '../../../../../common/types'
import styles from './TableControls.module.scss'

interface ITableControlProps {
    botData: LiquidityBotData
}

export const TableControls: React.FC<ITableControlProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleStartBot = () => {
        setIsLoading(true)
        fetch(`/api/bot/${props.botData.id}/start`)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }

    const handleStopBot = () => {
        setIsLoading(true)
        fetch(`/api/bot/${props.botData.id}/stop`)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }

    const handleDeleteBot = () => {
        setIsLoading(true)
        fetch(`/api/bot/${props.botData.id}/delete`)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }

    if (!props.botData) {
        return null;
    }

    if (!props.botData.configBot) return <span>Loading...</span>;

    return (
        <div className={styles.TableControls__wrapper}>
            <Stack gap={2} direction="horizontal" className={styles.TableControls}>
                {/*<Button variant="secondary" size="sm" href={`/${props.botData.id}`}>*/}
                {/*    <Sliders color="white" size={10}/>*/}
                {/*</Button>*/}
                <Button variant="secondary" size="sm" href={`/${props.botData.id}/logs`}>
                    <Printer color="white" size={10}/>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDeleteBot()}>
                    <XLg color="white" size={10}/>
                </Button>
                <Button
                    disabled={isLoading}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        if (props.botData.status) {
                            handleStopBot()
                        } else {
                            handleStartBot()
                        }
                    }}
                >
                    {
                        props.botData.status
                            ? <SquareFill color="white" size={10}/>
                            : <CaretRightFill color="white" size={10}/>
                    }
                </Button>
                <Button variant="secondary" size="sm" onClick={handleShowModal}>
                    <ExclamationOctagon color="white" size={10}/>
                </Button>
            </Stack>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Bot configuration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {/* @ts-ignore */}
                        {Object.entries(props.botData.configBot).map(([key, value]) => key !== "isEnabled" && <li key={key}>{key} - {value}</li>)}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
