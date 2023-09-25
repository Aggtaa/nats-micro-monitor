import styles from './MainPage.module.css'

export const Header = () => {
    return (
        <thead className={styles.Header}>
            <tr>
                <th>
                    Name
                </th>

                <th className={styles.id}>
                    Instance ID
                </th>

                <th className={styles.description}>
                    Description
                </th>

                <th>
                    Version
                </th>

                <th>
                    Last seen
                </th>

                <th>
                    IP
                </th>

                <th
                    style={{
                        minWidth: '80px',
                        textAlign: 'right'
                    }}
                >
                    Ping
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

                <th style={{ textAlign: 'center' }} />
            </tr>
        </thead>
    )
}


