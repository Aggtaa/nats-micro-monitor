import { HealthStatus } from "../HealthStatus"
import { MicroserviceInfo } from "../../types/MicroserviceInfo"

import { Button } from "antd"

import styles from './MicroserviceListInfo.module.css'

interface Props {
    items: MicroserviceInfo[]
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
                <td style={{ whiteSpace: "nowrap" }}>
                    {time}
                </td>
                <td>
                    {item.name}
                </td>
                <td>
                    {item.id}
                </td>
                <td>
                    {item.description}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {item.version}
                </td>
                <td style={{ textAlign: 'center' }}>
                    30ms
                </td>
                <td>
                    <HealthStatus status={item.healthStatus.value} />
                </td>
                <td style={{ textAlign: 'center' }}>
                    <a href="#">Info</a>
                </td>
                <td style={{ textAlign: 'center' }}>
                    <a href="#">Stats</a>
                </td>
                <td style={{ textAlign: 'center' }}>
                    {(item.status == 0) && (
                        <Button type="primary" style={{ background: '#00b96b' }}>
                            Start
                        </Button>
                    )}

                    {(item.status != 0) && (
                        <Button type="primary" danger>
                            Stop
                        </Button>
                    )}
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


