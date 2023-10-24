import classNames from 'classnames'
import { Health } from '@nats-micro-monitor/types'

import styles from './HealthStatus.module.css'

interface Props {
    status?: Health;
}

export const HealthStatus = ({ status }: Props) => {
    const { value } = status || {}

    const className = classNames({
        [styles.HeaderStatus]: true,
        [styles.HeaderStatus_green]: value == 'green',
        [styles.HeaderStatus_yellow]: value == 'yellow',
        [styles.HeaderStatus_red]: value == 'red',
    })

    return (
        <div className={className} />
    )
}