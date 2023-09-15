import { Broker, Microservice } from 'nats-micro';

import { FlickerMicroservice } from './microservice.js';

(async () => {

  const broker = await new Broker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  }).connect();

  const flicker = new FlickerMicroservice(5, 15);
  flicker.microservice = await Microservice.createFromClass(broker, flicker);
})()
  .catch(console.error);
