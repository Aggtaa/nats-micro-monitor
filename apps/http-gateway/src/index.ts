import express from 'express';
import { Broker, Monitor } from 'nats-micro';

import { Router } from './router.js';

(async () => {

  const broker = new Broker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  });

  await broker.connect();

  const router = new Router(broker);

  const monitor = new Monitor(broker);

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

  const app = express();

  app.use(router.middleware.bind(router));

  app.listen(5555, () => {
    console.log('Web app is ready');
  });
})()
  .catch(console.error);
