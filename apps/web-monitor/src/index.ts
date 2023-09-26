import { Microservice, Monitor } from 'nats-micro';

import { Client } from './client.js';
import { WebMonitorMicroservice } from './microservice.js';

(async () => {

  const client = new Client();

  await client.connect();

  const monitor = new Monitor(client.userBroker, client.systemBroker);

  const service = new WebMonitorMicroservice();
  service.start(client.userBroker, monitor);

  monitor.startPeriodicDiscovery(5000, 3000);

  await Microservice.createFromClass(client.userBroker, service);
})()
  .catch(console.error);
