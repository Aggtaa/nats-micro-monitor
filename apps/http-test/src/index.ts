import { SubjectHttpRoute } from '@nats-micro-monitor/types';
import { NatsBroker, Microservice, wrapMethod } from 'nats-micro';

import { HttpTestMicroservice } from './microservice.js';

(async () => {

  const broker = await new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  }).connect();

  const service = new HttpTestMicroservice();
  await Microservice.createFromClass(broker, service);

  const sub = broker.createInbox();

  broker.on(
    sub,
    wrapMethod(
      broker,
      (req, res) => {
        res.send('hello world');
      },
      {
        microservice: 'hello-world',
        method: 'none',
      },
    ),
  );

  broker.send(
    'http-gateway.route',
    {
      route: {
        microservice: '123456789',
        subject: sub,
        domain: '',
        path: '/test',
        methods: ['ALL'],
      } as SubjectHttpRoute,
      change: 'change',
    },
  );

})()
  .catch(console.error);
