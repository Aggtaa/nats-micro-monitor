import { Health } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
} from 'nats-micro';

import { Route, Router } from './router.js';

const statusSchema = z.object({
  routes: z.custom<Route[]>(),
});

type Status = z.infer<typeof statusSchema>;

@microservice()
export class HttpGatewayMicroservice {

  public __microservice: Microservice | undefined;

  public router: Router | undefined;

  public async start(router: Router) {
    this.router = router;
  }

  @method()
  public async health(): Promise<Health> {
    return {
      value: 'green',
    };
  }

  @method()
  public async status(): Promise<Status> {
    return {
      routes: this.router?.routes ?? [],
    };
  }
}
