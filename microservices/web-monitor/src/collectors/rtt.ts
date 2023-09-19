import { Broker, MicroservicePing } from 'nats-micro';

import { MicroserviceInfoCollector } from './base.js';

export class MicroserviceRttCollector extends MicroserviceInfoCollector<number> {

  private readonly inbox: string;
  private startTime: bigint | undefined;

  constructor(private readonly broker: Broker) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  protected collectAll(): void {

    this.startTime = process.hrtime.bigint();

    this.broker.send(
      '$SRV.PING',
      '',
      { replyTo: this.inbox },
    );
  }

  public collect(): void {
    this.collectAll();
  }

  private handleResponse({ data }: { data: MicroservicePing }): void {
    const time = Number(process.hrtime.bigint() - this.startTime);
    this.save(data.id, Math.round(time / 1000) / 1000);
  }
}
