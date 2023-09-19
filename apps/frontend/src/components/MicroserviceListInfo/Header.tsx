import styles from './MicroserviceListInfo.module.css'

export const Header = () => {
    return (
        <thead className={styles.Header}>
            <tr>
                <th>
                    LastFoundAt
                </th>
                <th>
                    Name
                </th>
                <th>
                    Instance ID
                </th>
                <th style={{ width: '100%' }}>
                    Descriptionm
                </th>
                <th>
                    Verion
                </th>
                <th>
                    RTT
                </th>
                <th>
                    Health
                </th>
                <th>
                    Info
                </th>
                <th>
                    Status
                </th>
                <th style={{ textAlign: 'center' }}>
                    [Start/Stop]
                </th>
                <th style={{ textAlign: 'center' }}>
                    [Restart]
                </th>
            </tr>
        </thead>
    )
}

