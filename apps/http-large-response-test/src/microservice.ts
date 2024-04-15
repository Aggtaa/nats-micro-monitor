import { Health, HttpRequest } from '@nats-micro-monitor/types';
import fs from 'fs';
import {
  microservice, method, z, Microservice,
  Request, Response,
} from 'nats-micro';

const microserviceStatusSchema = z.object({
});

type MicroserviceStatus = z.infer<typeof microserviceStatusSchema>;

@microservice({
  name: 'large-http-test',
  version: '1.0.0',
  description: 'Serves large text requests',
})
export class MS {
  public microservice: Microservice | undefined;

  @method({
    request: z.custom<HttpRequest>(),
    response: z.string(),
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'large',
      'nats-micro.v1.http.endpoint.methods': 'GET',
    },
  })
  public large(_req: Request<HttpRequest>, res: Response<string>): void {
    res.send(fs.readFileSync('./file.txt', 'utf8'));
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
    response: z.custom<MicroserviceStatus>(),
  })
  public status(_req: Request<void>, res: Response<MicroserviceStatus>): void {
    res.send({
    });
  }
}
