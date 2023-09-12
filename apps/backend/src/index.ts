import express from 'express';
import { Monitor } from 'nats-micro';

import { Client } from './client.js';

(async () => {

  const client = new Client();

  await client.connect();

  const monitor = new Monitor(client.userBroker, client.systemBroker);
  monitor.on('added', (service) => {
    console.log(`SERVICE ADDED: ${service.name}.${service.id}`);
  });
  monitor.on('removed', (service) => {
    console.log(`SERVICE REMOVED: ${service.name}.${service.id}`);
  });
  monitor.on('change', (services) => {
    console.log(`SERVICES: ${services.map((s) => `${s.name}.${s.id}`)}`);
  });

  monitor.startPeriodicDiscovery(60000, 30000);

  const app = express();

  app.get('/discover.json', async (req, res) => {
    try {
      monitor.discover(30000);
      res.json('ok');
    }
    catch (err) {
      console.error(err);
      res.status(500);
      res.send(JSON.stringify(err));
    }
  });

  app.get('/services.json', async (req, res) => {
    try {
      const services = [...monitor.services];
      res.json(services);
    }
    catch (err) {
      console.error(err);
      res.status(500);
      res.send(JSON.stringify(err));
    }
  });

  app.listen(5555, () => {
    console.log('Web app is ready');
  });
})()
  .catch(console.error);
