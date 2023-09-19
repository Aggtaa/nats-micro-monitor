import { Health } from '@nats-micro-monitor/types';
import { Broker } from 'nats-micro';

import { MicroserviceInfoCollector } from './base.js';

export class MicroserviceHealthCollector extends MicroserviceInfoCollector<Health> {

  private readonly inbox: string;

  constructor(private readonly broker: Broker) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  public collectAll(): void {
    throw new Error('Method not implemented.');
  }

  public collect(id: string): void {
    // TODO
  }

  private handleResponse(res: unknown): void {
    console.dir({ stats: res });
  }
}
