import { useEffect, useState } from "react"
import { MicroserviceInfo } from "../../types/MicroserviceInfo"
import { MicroserviceListInfo } from "../../components/MicroserviceListInfo"

export const MainPage = () => {
    const [data, setData] = useState<MicroserviceInfo[]>([] as MicroserviceInfo[])

    useEffect(() => {
        const url = "./services.json"

        const fetchData = async () => {
            try {
                const response = await fetch(url)
                const json = await response.json()

                // {error: "Cannot read properties of undefined (reading 'endpoints')"}

                setData(json)
            } catch (error) {
                console.log("error", error)
            }
        }

        fetchData()
    }, [])

    console.log('data', data)

    return (
        <div>
            <MicroserviceListInfo items={data} />
        </div>
    )
}