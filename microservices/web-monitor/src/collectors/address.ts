import { BaseMicroserviceData, Broker, MicroserviceInfo, MicroservicePing } from 'nats-micro';
import { isUndefined } from 'util';

import { MicroserviceInfoCollector } from './base.js';

export abstract class AddressMicroserviceCollector<T, P> extends MicroserviceInfoCollector<T> {

  private readonly inbox: string;

  private requests: Record<string, P> = {};

  constructor(
    protected readonly broker: Broker,
    private readonly subjectPrefix: string,
  ) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  private getSubject(service: BaseMicroserviceData): string {
    return `${this.subjectPrefix}.${service.name}.${service.id}`;
  }

  public collect(service: MicroserviceInfo): void {

    const subject = this.getSubject(service);
    this.requests[subject] = this.prepareRequest(service);

    this.broker.send(
      subject,
      '',
      { replyTo: this.inbox },
    );
  }

  protected abstract prepareRequest(service: BaseMicroserviceData): P;
  protected abstract processRequest(service: BaseMicroserviceData, precursor: P): void;

  private handleResponse({ data }: { data: MicroservicePing }): void {

    const subject = this.getSubject(data);
    const precursor = this.requests[subject];
    if (isUndefined(precursor))
      return;

    this.processRequest(data, precursor);
  }
}
