import { observer } from "mobx-react"
import { MonitoredMicroservice } from "@nats-micro-monitor/types"

import { List } from "./List"
import { Header } from "./Header"

import styles from './MainPage.module.css'

interface Props {
    data: MonitoredMicroservice[]
}

export const MainPage = observer(({ data }: Props) => {
    return (
        <div>
            <table className={styles.Container}>
                <Header />

                <tbody className={styles.Content}>
                    <List items={data} />
                </tbody>
            </table>
        </div>
    )
})
