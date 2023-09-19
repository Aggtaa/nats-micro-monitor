import { Broker, MicroserviceStats } from 'nats-micro';

import { MicroserviceInfoCollector } from './base.js';

export class MicroserviceStatsCollector extends MicroserviceInfoCollector<MicroserviceStats> {

  private readonly inbox: string;

  constructor(private readonly broker: Broker) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  public collectAll(): void {
    this.broker.send(
      '$SRV.STATS',
      '',
      { replyTo: this.inbox },
    );
  }

  public collect(id: string): void {
    throw new Error('Method not implemented.');
  }

  private handleResponse(res: unknown): void {
    console.dir({ stats: res });
  }
}
