import { NatsBroker } from 'nats-micro';

export class Brokers {
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
  }

  async disconnect() {
    await this.userBroker.disconnect();
    await this.systemBroker.disconnect();
  }
}
