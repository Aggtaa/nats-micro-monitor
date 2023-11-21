import { Health, HttpRoute, SubjectHttpRoute } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
  Request, Response,
} from 'nats-micro';

import { Router } from './router.js';

const statusSchema = z.object({
  routes: z.custom<HttpRoute[]>(),
});

type Status = z.infer<typeof statusSchema>;

const changedRouteSchema = z.custom<SubjectHttpRoute>();

const changeRouteRequestSchema = z.object({
  route: changedRouteSchema,
  change: z.enum(['change', 'delete']),
});

type ChangeRouteRequest = z.infer<typeof changeRouteRequestSchema>;

@microservice({ version: '0.15.1', description: 'Microservice HTTP gateway' })
export class HttpGatewayMicroservice {

  public __microservice: Microservice | undefined;

  public router: Router | undefined;

  public async start(router: Router) {
    this.router = router;
  }

  @method<ChangeRouteRequest, void>({
    unbalanced: true,
  })
  public route(req: Request<ChangeRouteRequest>): void {
    if (req.data.change === 'delete')
      this.router.removeMethodRoute(
        req.data.route.microservice,
        req.data.route.subject,
      );
    else
      this.router.addRoute(req.data.route);
  }

  @method<unknown, Health>()
  public health(req: Request<unknown>, res: Response<Health>): void {
    res.send({
      value: 'green',
    });
  }

  @method<unknown, Status>()
  public status(req: Request<unknown>, res: Response<Status>): void {
    res.send({
      routes: this.router?.routes ?? [],
    });
  }
}
