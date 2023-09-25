import { observer } from "mobx-react"
import { microserviceData } from "../../store"
import { HealthStatus, Ping, JsonPreview } from "../../components"
import { toDate } from "../../utils/timeConverter"

import pageStyles from '../Page.module.css'

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
        <div className={pageStyles.Container}>
            <div
                style={{
                    padding: '20px'
                }}
            >
                <div>
                    <b>name:</b> {data?.info.name}
                </div>

                <div>
                    <b>id</b>: {id}
                </div>

                <div>
                    <b>version</b>: {data?.info.version}
                </div>

                <div>
                    <b>firstFoundAt</b>: {firstFoundAt}
                </div>

                <div>
                    <b>lastFoundAt</b>: {lastFoundAt}
                </div>

                <div>
                    <b>health</b>: <HealthStatus status={data?.health} />
                </div>

                <div>
                    <b>ping</b>: <Ping value={data?.rtt} />
                </div>

                <div>
                    <b>metadata</b>:

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        <JsonPreview value={data?.info.metadata} />
                    </div>
                </div>

                <div>
                    <h3>info</h3>

                    <div>
                        <b>type</b>: {data?.info.type}
                    </div>

                    {data?.info.description && (
                        <div>
                            <b>description</b>:

                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {data?.info.description}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <h3>stats</h3>

                    <div>
                        <b>type</b>: {data?.stats?.type}
                    </div>

                    <div>
                        <b>started</b>: {toDate(data?.stats?.started)}
                    </div>
                </div>

                <div>
                    <h3>endpoints</h3>

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        <JsonPreview value={endpoints} />
                    </div>
                </div>
            </div>
        </div>
    )
})