import { observer } from "mobx-react"
import { microserviceData } from "../../store"

interface Props {
    id?: string;
}

export const StatusPage = observer(({ id }: Props) => {
    if (!id) {
        return (
            <div>
                error no id
            </div>
        )
    }

    const data = microserviceData.getInfoById(id)

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
                    <b>status</b>:

                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data?.status, null, 4)}
                    </div>
                </li>
            </ul>
        </div>
    )
})