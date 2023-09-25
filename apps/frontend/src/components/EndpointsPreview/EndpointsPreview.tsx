import { MethodInfo, MethodStats } from "nats-micro"
import { JsonPreview } from ".."

import styles from './EndpointsPreview.module.css'

interface Props {
    endpoints: MethodInfo[] | MethodStats[] | undefined
}

export const EndpointsPreview = ({ endpoints }: Props) => {
    return <JsonPreview value={endpoints} />

    return endpoints?.map((endpoint) => {
        const { name, subject, ...otherProps } = endpoint

        return (
            <div className={styles.Container}>
                <div><b>name:</b> {name}</div>
                <div><b>subject:</b> {subject}</div>

                <JsonPreview value={otherProps} />
            </div>
        )
    })
}
