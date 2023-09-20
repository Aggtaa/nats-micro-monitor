import styles from './MainPage.module.css'

export const Header = () => {
    return (
        <thead className={styles.Header}>
            <tr>
                <th>
                    #
                </th>

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
                    Description
                </th>

                <th>
                    Version
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

                <th style={{ textAlign: 'center' }} />

                <th style={{ textAlign: 'center' }} />
            </tr>
        </thead>
    )
}


