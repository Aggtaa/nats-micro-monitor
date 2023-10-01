import bodyParser from 'body-parser';
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

  const service = new HttpGatewayMicroservice();
  Microservice.createFromClass(broker, service);

  const router = new Router(broker);
  service.start(router);

  const monitor = new Monitor(broker, sysBroker);

  monitor.on('added', (svc) => {
    router.addServiceRoutes(svc);
  });

  monitor.on('removed', (svc) => {
    router.removeServiceRoutes(svc);
  });

  monitor.on('change', (svcs) => {
    router.clearRoutes();
    for (const svc of svcs)
      router.addServiceRoutes(svc);
  });

  // monitor.startPeriodicDiscovery(5000, 3000);

  const app = express();

  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.use(bodyParser.text());

  app.use(router.middleware.bind(router));

  app.listen(5555, () => {
    console.log('Web app is ready');
  });
})()
  .catch(console.error);
