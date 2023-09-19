import { Broker } from 'nats-micro';

import { MicroserviceInfoCollector } from './base.js';

export class MicroserviceRttCollector extends MicroserviceInfoCollector<number> {

  private readonly inbox: string;
  private startTime: bigint | undefined;

  constructor(private readonly broker: Broker) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  public collectAll(): void {

    this.startTime = process.hrtime.bigint();

    this.broker.send(
      '$SRV.PING',
      '',
      { replyTo: this.inbox },
    );
  }

  public collect(id: string): void {
    throw new Error('Method not implemented.');
  }

  private handleResponse(res: unknown): void {
    console.dir({ ping: res });
  }
}
