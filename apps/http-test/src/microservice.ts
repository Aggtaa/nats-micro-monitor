import { Health, HttpRequest } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
  Request, Response,
} from 'nats-micro';

const statusSchema = z.object({
  dummy: z.string(),
});

type Status = z.infer<typeof statusSchema>;

@microservice({ version: '1.0.0', description: 'Public HTTP method test' })
export class HttpTestMicroservice {

  public __microservice: Microservice | undefined;

  // @middleware(httpHandler())
  @method({
    request: z.custom<HttpRequest>(),
    response: z.string(),
    metadata: {
      'nats-micro.v1.http.endpoint.domain': '',
      'nats-micro.v1.http.endpoint.path': '',
      'nats-micro.v1.http.endpoint.methods': 'GET|POST',
    },
  })
  public index(_req: Request<HttpRequest>, res: Response<string>): void {
    res.send(`hello from ${this.__microservice?.config.name}`);
  }

  @method({
    request: z.custom<HttpRequest>(),
    response: z.string(),
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'test',
    },
  })
  public test(req: Request<HttpRequest>, res: Response<string>): void {
    res.send(`Current time at ${req.data.url} is ${new Date().toLocaleString()}`);
  }

  @method({
    request: z.custom<HttpRequest>(),
    response: z.void(),
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'user/:user/profile',
    },
  })
  public error(req: Request<HttpRequest>, res: Response<void>): void {
    new RegExp('a')
  }

  @method({
    request: z.void(),
    response: z.custom<Health>(),
  })
  public health(_req: Request<void>, res: Response<Health>): void {
    res.send({
      value: 'green',
    });
  }

  @method({
    request: z.void(),
    response: statusSchema,
  })
  public status(_req: Request<void>, res: Response<Status>): void {
    res.send({
      dummy: 'hello',
    });
  }
}
