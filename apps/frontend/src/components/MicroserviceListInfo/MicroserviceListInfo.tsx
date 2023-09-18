import { MicroserviceInfo } from "../../types/MicroserviceInfo"

import { List } from "./List"
import { Header } from "./Header"

import styles from './MicroserviceListInfo.module.css'

interface Props {
    items: MicroserviceInfo[]
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


