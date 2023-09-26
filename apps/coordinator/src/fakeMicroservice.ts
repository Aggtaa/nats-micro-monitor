import { Broker, MessageMaybeReplyTo, Microservice } from 'nats-micro';

export class FakeMicroservice<T> {
  private ms: Microservice | undefined;

  constructor(
    private readonly broker: Broker,
    public readonly node: string,
    public readonly name: string,
    public readonly description: string,
    public readonly version: string,
    private readonly startCallback: (msg: MessageMaybeReplyTo<T>) => Promise<void>,
  ) {
  }

  public async start(): Promise<void> {
    this.ms = await Microservice.create(
      this.broker,
      () => ({
        name: this.name,
        description: this.description,
        version: this.version,
        metadata: {
          'nats.micro.ext.v1.service.starter': 'true',
          'nats.micro.ext.v1.service.node': this.node,
        },
        methods: {
          start: {
            subject: `$SRV.REQ.${this.name}.START`,
            local: true,
            unbalanced: true,
            handler: (msg) => this.startCallback(msg),
            metadata: {
              'nats.micro.ext.v1.feature': 'microservice_start',
              'nats.micro.ext.v1.feature.params': `{"name": "${this.name}", "id": "${this.ms?.id}"}`,
            },
          },
        },
      }),
      {
        noStopMethod: true,
      },
    );
  }

  public async stop(): Promise<void> {
    await this.ms?.stop();
  }
}
