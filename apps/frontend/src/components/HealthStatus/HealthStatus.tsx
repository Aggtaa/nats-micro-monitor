import classNames from 'classnames'

import styles from './HealthStatus.module.css'

interface Props {
    status: number;
}

export const HealthStatus = ({ status }: Props) => {
    const className = classNames({
        [styles.HeaderStatus]: true,
        [styles.HeaderStatus_green]: status == 1,
        [styles.HeaderStatus_yellow]: status == 2,
        [styles.HeaderStatus_red]: status == 3,
    })

    return (
        <div className={className} />
    )
}