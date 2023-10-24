import { BaseMicroserviceData, Broker } from 'nats-micro';

import { AddressMicroserviceCollector } from './address.js';

export class MicroserviceRttCollector extends AddressMicroserviceCollector<number, bigint> {

  constructor(broker: Broker) {
    super(broker, '$SRV.PING');
  }

  protected prepareRequest(): bigint {
    return process.hrtime.bigint();
  }

  protected processRequest(service: BaseMicroserviceData, startTime: bigint): void {
    const time = Number(process.hrtime.bigint() - startTime);
    this.save(service.id, Math.round(time / 1000));
  }
}
