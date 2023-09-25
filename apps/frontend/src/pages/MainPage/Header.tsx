import styles from './MainPage.module.css'

export const Header = () => {
    return (
        <thead className={styles.Header}>
            <tr>
                <th>
                    Name
                </th>

                <th>
                    Instance ID
                </th>

                <th style={{ width: '100%' }}>
                    Description
                </th>

                <th>
                    Version
                </th>

                <th>
                    Last seen
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

                <th style={{ textAlign: 'center' }} />
            </tr>
        </thead>
    )
}


