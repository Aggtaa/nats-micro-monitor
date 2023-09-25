import { Microservice, NatsBroker } from 'nats-micro';
import { resolve } from 'path';

import { Coordinator } from './coordinator.js';
import { CoordinatorMicroservice } from './microservice.js';

(async () => {

  const broker = await new NatsBroker({
    servers: process.env.NATS_URL,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
  }).connect();

  const coordinator = new Coordinator(process.env.MICROSERVICE_NODE_NAME ?? 'local', broker);
  const service = new CoordinatorMicroservice(coordinator);
  await Microservice.createFromClass(broker, service);

  const config = {
    directories: [
      {
        path: resolve('../../microservices'),
        nestDepth: 2,
      },
    ],
  };

  for (const directory of config.directories)
    await coordinator.discoverModulesInDir(directory.path, directory.nestDepth);

  // await coordinator.addModuleFromDir(resolve('../../microservices/flicker'));

})()
  .catch(console.error);
