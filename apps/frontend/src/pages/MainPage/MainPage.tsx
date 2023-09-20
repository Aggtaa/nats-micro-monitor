import { observer } from "mobx-react"
import { MonitoredMicroservice } from "@nats-micro-monitor/types"
import { MicroserviceListInfo } from "../../components/MicroserviceListInfo"

interface Props {
    data: MonitoredMicroservice[]
}

export const MainPage = observer(({ data }: Props) => {
    return (
        <div>
            <MicroserviceListInfo items={data} />
        </div>
    )
})