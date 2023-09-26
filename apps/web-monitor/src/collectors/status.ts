import { Broker, MicroserviceInfo } from 'nats-micro';

import { MicroserviceInfoCollector } from './base.js';

export class MicroserviceStatusCollector
  extends MicroserviceInfoCollector<Record<string, unknown>> {

  private readonly inbox: string;

  constructor(private readonly broker: Broker) {
    super();

    this.inbox = this.broker.createInbox();
    this.broker.on(this.inbox, this.handleResponse.bind(this));
  }

  protected collectAll(): void {
    throw new Error('Method not implemented.');
  }

  public async collect(service: MicroserviceInfo): Promise<void> {
    try {
      const endpoint = service.endpoints.find((ep) => ep.name === 'status');
      if (!endpoint)
        return;

      const result = await this.broker.request(endpoint.subject, '') as Record<string, unknown>;
      this.save(service.id, result);
    }
    catch { /* empty */ }
  }

  private handleResponse(res: unknown): void {
    console.dir({ status: res });
  }
}
