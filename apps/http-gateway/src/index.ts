import cors from 'cors';
import express from 'express';
import { Microservice, Monitor, NatsBroker } from 'nats-micro';

import { HttpGatewayMicroservice } from './microservice.js';
import { Router } from './router.js';

(async () => {

  const broker = new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  });

  await broker.connect();

  const sysBroker = new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_SYSTEM_USERNAME,
    pass: process.env.NATS_SYSTEM_PASSWORD,
  });

  await sysBroker.connect();

  const router = new Router(broker);

  const monitor = new Monitor(broker, sysBroker);

  monitor.on('added', (service) => {
    router.addServiceRoutes(service);
  });

  monitor.on('removed', (service) => {
    router.removeServiceRoutes(service);
  });

  monitor.on('change', (services) => {
    router.clearRoutes();
    for (const service of services)
      router.addServiceRoutes(service);
  });

  monitor.startPeriodicDiscovery(60000, 10000);

  const service = new HttpGatewayMicroservice();
  service.start(router);
  Microservice.createFromClass(broker, service);

  const app = express();

  app.use(cors());

  app.use(router.middleware.bind(router));

  app.listen(5555, () => {
    console.log('Web app is ready');
  });
})()
  .catch(console.error);
