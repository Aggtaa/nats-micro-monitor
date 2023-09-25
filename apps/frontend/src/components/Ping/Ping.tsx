import { toMs } from "../../utils/timeConverter"

interface Props {
    value?: number;
}

export const Ping = ({ value }: Props) => {
    const time = toMs(value)

    return (
        <span style={{ color: (time > 200) ? '#ff4d4d' : '' }}>
            {time} ms
        </span>
    )
}