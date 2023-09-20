import { observer } from "mobx-react"
import { microserviceData } from "../../store"
import { toJS } from "mobx";
import { HealthStatus } from "../../components";

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

    console.log('data', toJS(data))

    const firstFoundAt = data?.firstFoundAt && new Date(data.firstFoundAt).toLocaleString() || ''
    const lastFoundAt = data?.lastFoundAt && new Date(data.lastFoundAt).toLocaleString() || ''

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
                    <b>info endpoint</b>:

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data?.info.endpoints, null, 4)}
                    </div>
                </li>

                <li>
                    <b>info stats</b>:

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data?.stats, null, 4)}
                    </div>
                </li>
            </ul>
        </div>
    )
})