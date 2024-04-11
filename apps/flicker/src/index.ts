import { Microservice, NatsBroker } from 'nats-micro';

import { FlickerMicroservice } from './microservice.js';

(async () => {

  const broker = await new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  }).connect();

  const flicker = new FlickerMicroservice(3, -1);
  flicker.microservice = await Microservice.createFromClass(broker, flicker);

  flicker.microservice.on('close', () => broker.disconnect());
})()
  .catch(console.error);
