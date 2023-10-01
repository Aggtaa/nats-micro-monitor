import { Microservice, Monitor } from 'nats-micro';

import { Brokers } from './brokers.js';
import { WebMonitorMicroservice } from './microservice.js';

(async () => {

  const brokers = new Brokers();
  await brokers.connect();

  const monitor = new Monitor(brokers.userBroker, brokers.systemBroker);

  const service = new WebMonitorMicroservice();
  service.start(brokers.userBroker, monitor);

  monitor.startPeriodicDiscovery(5000, 3000);

  await Microservice.createFromClass(brokers.userBroker, service);
})()
  .catch(console.error);
