import { NatsBroker, Message } from 'nats-micro';

type UserConnectEvent = {
  client: {
    id: number;
    acc: string;
  }
}

type UserDisconnectEvent = UserConnectEvent;

export class Client {
  public readonly userBroker = new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  });

  public readonly systemBroker = new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_SYSTEM_USERNAME,
    pass: process.env.NATS_SYSTEM_PASSWORD,
  });

  async connect() {
    await this.userBroker.connect();
    await this.systemBroker.connect();

    // this.broker.on('$SYS.>', wrapMethod(this.broker, this.handleSystemMessage.bind(this), 'handleSystemMessage'));
    // this.broker.on('$SYS.ACCOUNT.*.CONNECT', this.handleAccountConnect.bind(this));
    // this.broker.on('$SYS.ACCOUNT.*.DISCONNECT', this.handleAccountDisconnect.bind(this));
    // this.broker.on('$SYS.>', this.handleSystemMessage2.bind(this));
  }

  async disconnect() {
    this.userBroker.disconnect();
  }

  private call<T, R>(microservice: string, method: string, data: T): Promise<R> {
    return this.userBroker.request({ microservice, method }, data);
  }

  private async handleAccountConnect(msg: Message<UserConnectEvent>): Promise<void> {
    console.log(`Client ${msg.data.client.id} (Account "${msg.data.client.acc}") connected`);
  }

  private async handleAccountDisconnect(msg: Message<UserDisconnectEvent>): Promise<void> {
    console.log(`Client ${msg.data.client.id} (Account "${msg.data.client.acc}") disconnected`);
  }

  private async handleSystemMessage2(msg: unknown, subject: string): Promise<void> {
    console.log(subject);
    console.log(JSON.stringify(msg, undefined, 4));
  }
}
