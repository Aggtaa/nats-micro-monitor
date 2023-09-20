import { Button } from "antd"
import { MonitoredMicroservice } from "@nats-micro-monitor/types"

import { HealthStatus } from "../../components"

import styles from './MainPage.module.css'

interface Props {
    items: MonitoredMicroservice[]
}

export const List = (props: Props) => {
    const { items = [] } = props

    return items.map((item, index) => {
        const time = new Date(item.lastFoundAt).toLocaleString()

        return (
            <tr
                key={index}
                className={styles.ListItem}
            >
                <th>
                    {index + 1}
                </th>

                <td style={{ whiteSpace: "nowrap" }}>
                    {time}
                </td>

                <td style={{ whiteSpace: "nowrap" }}>
                    {item.info.name}
                </td>

                <td>
                    {item.info.id}
                </td>

                <td>
                    {item.info.description}
                </td>

                <td>
                    {item.info.version}
                </td>

                <td>
                    {item.rtt}
                </td>

                <td style={{ textAlign: 'center' }}>
                    <HealthStatus status={item?.health} />
                </td>

                <td style={{ textAlign: 'center' }}>
                    <a href={`#page=info&id=${item.info.id}`}>Info</a>
                </td>

                <td style={{ textAlign: 'center' }}>
                    <a href={`#page=status&id=${item.info.id}`}>Status</a>
                </td>

                <td style={{ textAlign: 'center' }}>
                    <Button type="primary" danger>
                        Stop
                    </Button>
                </td>

                <td style={{ textAlign: 'center' }}>
                    <Button type="primary" danger>
                        Restart
                    </Button>
                </td>
            </tr>
        )
    })
}


