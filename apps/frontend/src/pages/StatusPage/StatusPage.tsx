import { observer } from "mobx-react"
import { microserviceData } from "../../store"
import { JsonPreview } from "../../components"

import pageStyles from '../Page.module.css'
import { PropertyPreview } from "../../components/PropertyPreview";

interface Props {
    id?: string;
}

export const StatusPage = observer(({ id }: Props) => {
    if (!id) {
        return (
            <div>
                Error, microservice ID not found
            </div>
        )
    }

    const data = microserviceData.getInfoById(id)

    return (
        <div className={pageStyles.Container}>
            <div
                style={{
                    padding: '20px'
                }}
            >
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

                <PropertyPreview label="status">
                    <JsonPreview value={data?.status} />
                </PropertyPreview>
            </div>
        </div>
    )
})