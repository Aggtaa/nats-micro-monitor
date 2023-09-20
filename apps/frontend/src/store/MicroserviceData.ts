import { MonitoredMicroservice } from "@nats-micro-monitor/types"
import { action, observable, makeObservable } from "mobx"

const url = "./services.json"

export class MicroserviceData {
    constructor() {
        makeObservable(this)
    }

    @observable data: MonitoredMicroservice[] = []

    @action setData(value: MonitoredMicroservice[]) {
        this.data = value
    }

    fetchData = async () => {
        try {
            const response = await fetch(url)
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