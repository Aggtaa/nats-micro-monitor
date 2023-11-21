import { Microservice, NatsBroker } from 'nats-micro';

import { Authenticator } from './microservice.js';

(async () => {

  const broker = await new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  }).connect();

  const flicker = new Authenticator();
  await Microservice.createFromClass(broker, flicker);

  // try {
  //   const res = await broker.request('authenticator.login', { username: 'user', password: 'pass' });

  //   console.dir({ headers: Array.from(res.headers ?? []) });
  // }
  // catch (err) {
  //   console.dir({ err, status: (err as any)['status'] });
  // }

})()
  .catch(console.error);
