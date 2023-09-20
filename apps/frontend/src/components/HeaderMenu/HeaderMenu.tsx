import { Menu } from 'antd'
import { observer } from 'mobx-react'

import { router } from '../../store'
import { RouteName } from '../../store/Router'

export const HeaderMenu = observer(() => {
    const { name } = router.page

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[name]}
            style={{ flex: 1 }}
            items={[
                {
                    key: RouteName.HOME,
                    label: 'Home',
                    onClick: () => {
                        router.redirect({
                            name: RouteName.HOME
                        })
                    }
                },
                {
                    key: RouteName.INFO,
                    label: 'Info',
                },
                {
                    key: RouteName.STATUS,
                    label: 'Status',
                },
                {
                    key: '4',
                    label: 'About',
                },
            ]}
        />
    )
})
