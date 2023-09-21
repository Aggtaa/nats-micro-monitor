import { Broker, MicroserviceStats } from 'nats-micro';

import { AddressMicroserviceCollector } from './address.js';

export class MicroserviceStatsCollector
  extends AddressMicroserviceCollector<MicroserviceStats, void> {

  constructor(broker: Broker) {
    super(broker, '$SRV.STATS');
  }

  protected prepareRequest(): void {
    return undefined;
  }

  protected processRequest(service: MicroserviceStats): void {
    this.save(service.id, service);
  }
}
