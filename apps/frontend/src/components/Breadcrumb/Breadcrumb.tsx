import { observer } from "mobx-react"
import { Breadcrumb as BaseBreadcrumb } from "antd"

import { router } from "../../store"
import { RouteName } from "../../store/Router"

import styles from './Breadcrumb.module.css'

export const Breadcrumb = observer(() => {
    const { name } = router.page

    const items = [
        { title: 'Home' }
    ]

    if (name == RouteName.INFO) {
        items.push({ title: 'Info' })
    }

    if (name == RouteName.STATUS) {
        items.push({ title: 'Status' })
    }

    return (
        <BaseBreadcrumb
            className={styles.Container}
            items={items}
        />
    )
})
