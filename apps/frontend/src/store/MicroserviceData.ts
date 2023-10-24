import { action, observable, makeObservable } from "mobx"
import { MonitoredMicroservice } from "@nats-micro-monitor/types"

const URL_SERVICES = import.meta.env.VITE_API_SERVICES_HOST
const URL_DISCOVER = import.meta.env.VITE_API_DISCOVER_HOST

export class MicroserviceData {
    constructor() {
        makeObservable(this)

        // this.fetchDiscover()
        this.fetchServices()

        // setInterval(this.fetchDiscover, 5000)
        setInterval(this.fetchServices, 1000)
    }

    @observable data: MonitoredMicroservice[] = []

    @action setData(data: MonitoredMicroservice[] = []) {
        this.data = data
    }

    fetchDiscover = async () => {
        try {
            await fetch(URL_DISCOVER)

        } catch (error) {
            console.log("error", error)
        }
    }

    fetchServices = async () => {
        try {
            const response = await fetch(URL_SERVICES)
            const json = await response.json()

            this.setData(json)
        } catch (error) {
            console.log("error", error)
        }
    }

    getInfoById = (id: string): MonitoredMicroservice | undefined => {
        return this.data.find((microservice: MonitoredMicroservice) => {
            return microservice?.info?.id == id
        })
    }
}