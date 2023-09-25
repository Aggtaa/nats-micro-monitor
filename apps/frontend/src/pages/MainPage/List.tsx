import { Button } from "antd"
import { MonitoredMicroservice } from "@nats-micro-monitor/types"

import { HealthStatus, Ping } from "../../components"
import { toDate } from "../../utils/timeConverter"

import styles from './MainPage.module.css'

interface Props {
    items: MonitoredMicroservice[]
}

export const List = (props: Props) => {
    const { items = [] } = props

    return items.map((item, index) => {
        return (
            <tr
                key={index}
                className={styles.ListItem}
            >
                <td style={{ whiteSpace: 'nowrap' }}>
                    <a href={`#page=info&id=${item.info.id}`}>{item.info.name}</a>
                </td>

                <td>
                    <a href={`#page=info&id=${item.info.id}`}>{item.info.id}</a>
                </td>

                <td>
                    {item.info.description}
                </td>

                <td style={{ textAlign: 'center' }}>
                    {item.info.version}
                </td>

                <td style={{ whiteSpace: 'nowrap' }}>
                    {toDate(item.lastFoundAt)}
                </td>

                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {item?.connection?.client?.host}
                </td>

                <td
                    style={{
                        whiteSpace: 'nowrap',
                        textAlign: 'right',
                    }}
                >
                    <Ping value={item.rtt} />
                </td>

                <td style={{ textAlign: 'center' }}>
                    <HealthStatus status={item?.health} />
                </td>

                <td style={{ textAlign: 'center' }}>
                    <a href={`#page=info&id=${item.info.id}`}>Info</a>
                </td>

                <td style={{ textAlign: 'center' }}>
                    {item?.status && (
                        <a href={`#page=status&id=${item.info.id}`}>Status</a>
                    )}
                </td>

                <td style={{ textAlign: 'center' }}>
                    <Button type="primary" danger>
                        Stop
                    </Button>
                </td>
            </tr>
        )
    })
}


