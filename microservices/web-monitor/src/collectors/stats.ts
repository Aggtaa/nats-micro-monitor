import { Broker, MicroserviceInfo, MicroserviceStats } from 'nats-micro';

import { MicroserviceInfoCollector } from './base.js';

export class MicroserviceStatsCollector extends MicroserviceInfoCollector<MicroserviceStats> {

  private readonly inbox: string;

  constructor(private readonly broker: Broker) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  protected collectAll(): void {
    this.broker.send(
      '$SRV.STATS',
      '',
      { replyTo: this.inbox },
    );
  }

  public collect(): void {
    this.collectAll();
  }

  private handleResponse({ data }: { data: MicroserviceStats }): void {
    this.save(data.id, data);
  }
}
