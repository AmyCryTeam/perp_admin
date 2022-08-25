import React, { useState } from 'react'
import { Button, Stack } from 'react-bootstrap'
import { Printer, SquareFill, XLg, CaretRightFill } from 'react-bootstrap-icons'
import { LiquidityBotData } from '../../../../../common/types'
import styles from './TableControls.module.scss'

interface ITableControlProps {
    botData: LiquidityBotData
}

export const TableControls: React.FC<ITableControlProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false)

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
            </Stack>
        </div>
    )
}
