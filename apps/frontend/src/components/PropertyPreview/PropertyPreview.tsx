import classNames from 'classnames';
import styles from './PropertyPreview.module.css'

interface Props {
    label: string;
    value?: string;
    inline?: boolean;
    children?: JSX.Element | JSX.Element[]
}

export const PropertyPreview = ({ label, value, inline, children }: Props) => {
    const className = classNames({
        [styles.Container]: true,
        [styles.Container_inline]: inline
    })

    return (
        <div className={className}>
            <div className={styles.Label}>
                {label}
            </div>

            <div className={styles.Value}>
                {value}
                {children}
            </div>
        </div>
    )
}