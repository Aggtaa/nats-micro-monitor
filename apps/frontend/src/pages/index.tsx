import { observer } from "mobx-react"

import { microserviceData, router } from "../store"
import { RouteName } from "../store/Router"

import { MainPage } from "./MainPage"
import { InfoPage } from "./InfoPage"
import { StatusPage } from './StatusPage'

export const Pages = observer(() => {
    if (router.page.name == RouteName.INFO) {
        return <InfoPage id={router.page.id} />
    }

    if (router.page.name == RouteName.STATUS) {
        return <StatusPage id={router.page.id} />
    }

    return <MainPage data={microserviceData.data} />
})
