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
            <div>StatusPage: {id}</div>

            <div>{data?.info.name}</div>
        </div>
    )
})