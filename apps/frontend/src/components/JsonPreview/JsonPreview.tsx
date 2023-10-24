import styles from './JsonPreview.module.css'

interface Props {
    value?: Record<string, unknown> | Record<string, unknown>[];
}

export const JsonPreview = ({ value }: Props) => {
    return (
        <div className={styles.Container}>
            {JSON.stringify(value || '', null, 4)}
        </div>
    )
}