import { NatsBroker, Microservice } from 'nats-micro';

import { HttpTestMicroservice } from './microservice.js';

(async () => {

  const broker = await new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  }).connect();

  const service = new HttpTestMicroservice();
  await Microservice.createFromClass(broker, service);
})()
  .catch(console.error);
