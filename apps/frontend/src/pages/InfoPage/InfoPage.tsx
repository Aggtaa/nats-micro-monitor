import { observer } from "mobx-react"
import { microserviceData } from "../../store"
import { HealthStatus, Ping } from "../../components"
import { toDate } from "../../utils/timeConverter"

interface Props {
    id?: string;
}

export const InfoPage = observer(({ id }: Props) => {
    if (!id) {
        return (
            <div>
                Error, microservice ID not found
            </div>
        )
    }

    const data = microserviceData.getInfoById(id)

    const firstFoundAt = toDate(data?.firstFoundAt)
    const lastFoundAt = toDate(data?.lastFoundAt)

    const endpoints = data?.info?.endpoints.map((val, index) => {
        return {
            ...val,
            ...data?.stats?.endpoints[index]
        }
    })

    return (
        <div>
            <ul
                style={{
                    listStyleType: 'none',
                    padding: '20px'
                }}
            >
                <li>
                    <b>name:</b> {data?.info.name}
                </li>

                <li>
                    <b>id</b>: {id}
                </li>

                <li>
                    <b>version</b>: {data?.info.version}
                </li>

                <li>
                    <b>firstFoundAt</b>: {firstFoundAt}
                </li>

                <li>
                    <b>lastFoundAt</b>: {lastFoundAt}
                </li>

                <li>
                    <b>health</b>: <HealthStatus status={data?.health} />
                </li>

                <li>
                    <b>ping</b>: <Ping value={data?.rtt} />
                </li>

                <li>
                    <b>metadata</b>:

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data?.info.metadata, null, 4)}
                    </div>
                </li>

                <li>
                    <h3>info</h3>

                    <div>
                        <b>type</b>: {JSON.stringify(data?.info.type, null, 4)}
                    </div>

                    {data?.info.description && (
                        <div>
                            <b>description</b>:

                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {data?.info.description}
                            </div>
                        </div>
                    )}
                </li>

                <li>
                    <h3>stats</h3>

                    <div>
                        <b>type</b>: {JSON.stringify(data?.stats?.type, null, 4)}
                    </div>

                    <div>
                        <b>started</b>: {toDate(data?.stats?.started)}
                    </div>
                </li>

                <li>
                    <h3>endpoints</h3>

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(endpoints, null, 4)}
                    </div>
                </li>
            </ul>
        </div>
    )
})