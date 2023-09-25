import { observer } from "mobx-react"
import { microserviceData } from "../../store"
import { HealthStatus, Ping, JsonPreview } from "../../components"
import { toDate } from "../../utils/timeConverter"

import pageStyles from '../Page.module.css'
import { PropertyPreview } from "../../components/PropertyPreview"

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
    const inlineDescription = (data?.info.description.length || 0) <= 100

    return (
        <div className={pageStyles.Container}>
            <div
                style={{
                    padding: '20px'
                }}
            >
                <h3>general</h3>

                <PropertyPreview
                    label="name"
                    value={data?.info.name}
                    inline
                />

                <PropertyPreview
                    label="id"
                    value={id}
                    inline
                />

                <PropertyPreview
                    label="version"
                    value={data?.info.version}
                    inline
                />

                <PropertyPreview
                    label="firstFoundAt"
                    value={firstFoundAt}
                    inline
                />

                <PropertyPreview
                    label="lastFoundAt"
                    value={lastFoundAt}
                    inline
                />

                <PropertyPreview
                    label="health"
                    inline
                >
                    <HealthStatus status={data?.health} />
                </PropertyPreview>

                <PropertyPreview
                    label="ping"
                    inline
                >
                    <Ping value={data?.rtt} />
                </PropertyPreview>

                <PropertyPreview
                    label="lastFoundAt"
                    value={lastFoundAt}
                    inline
                />

                <PropertyPreview label="metadata">
                    <JsonPreview value={data?.info.metadata} />
                </PropertyPreview>

                <h3>info</h3>

                <PropertyPreview
                    label="type"
                    value={data?.info.type}
                    inline
                />

                <PropertyPreview
                    label="description"
                    value={data?.info.description}
                    inline={inlineDescription}
                />

                {data?.stats && (
                    <h3>stats</h3>
                )}

                <PropertyPreview
                    label="type"
                    value={data?.stats?.type}
                    inline
                />

                <PropertyPreview
                    label="started"
                    value={toDate(data?.stats?.started)}
                    inline
                />

                <h3>endpoints</h3>

                <PropertyPreview label="info">
                    <JsonPreview value={data?.info.endpoints} />
                </PropertyPreview>

                <PropertyPreview label="stats">
                    <JsonPreview value={data?.stats?.endpoints} />
                </PropertyPreview>
            </div>
        </div>
    )
})