import React, { useState } from 'react'
import { Button, Stack } from 'react-bootstrap'
import { Printer, Sliders, SquareFill, CaretRightFill } from 'react-bootstrap-icons'
import { LiquidityBotData } from '../../../../../common/types'
import styles from './TableControls.module.scss'

interface ITableControlProps {
    botData: LiquidityBotData
}

export const TableControls: React.FC<ITableControlProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleBotStart = () => {
        setIsLoading(true)
        fetch(`/api/bot/${props.botData.id}/start`)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }

    const handleBotStop = () => {
        setIsLoading(true)
        fetch(`/api/bot/${props.botData.id}/stop`)
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
                <Button variant="secondary" size="sm" href={`/${props.botData.id}`}>
                    <Sliders color="white" size={10}/>
                </Button>
                <Button variant="secondary" size="sm" href={`/${props.botData.id}/logs`}>
                    <Printer color="white" size={10}/>
                </Button>
                <Button
                    // disabled={isLoading}
                    disabled={true}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        if (props.botData.status) {
                            handleBotStop()
                        } else {
                            handleBotStart()
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
