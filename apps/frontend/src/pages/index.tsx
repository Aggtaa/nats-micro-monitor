import { useEffect } from 'react'
import { microserviceData, router } from "../store"
import { RouteName } from "../store/Router"

import { MainPage } from "./MainPage"
import { InfoPage } from "./InfoPage"
import { observer } from "mobx-react"

export const Pages = observer(() => {
    useEffect(() => {
        microserviceData.fetchData()
    }, [])

    if (router.page.name == RouteName.INFO) {
        return <InfoPage id={router.page.id} />
    }

    return <MainPage data={microserviceData.data} />
})
