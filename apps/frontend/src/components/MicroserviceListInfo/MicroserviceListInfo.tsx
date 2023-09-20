import { List } from "./List"
import { Header } from "./Header"
import { MonitoredMicroservice } from "@nats-micro-monitor/types"

import styles from './MicroserviceListInfo.module.css'

interface Props {
    items: MonitoredMicroservice[]
}

export const MicroserviceListInfo = (props: Props) => {
    const { items = [] } = props

    return (
        <table className={styles.Container}>
            <Header />

            <tbody className={styles.Content}>
                <List items={items} />
            </tbody>
        </table>
    )
}


