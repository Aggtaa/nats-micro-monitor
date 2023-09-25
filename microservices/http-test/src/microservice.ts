import { Health, HttpRequest } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
} from 'nats-micro';

const statusSchema = z.object({
  dummy: z.string(),
});

type Status = z.infer<typeof statusSchema>;

@microservice({ version: '1.0.0', description: 'Public HTTP method test' })
export class HttpTestMicroservice {

  public __microservice: Microservice | undefined;

  @method({
    metadata: {
      'nats-micro.v1.http.endpoint.domain': '',
      'nats-micro.v1.http.endpoint.path': '',
      'nats-micro.v1.http.endpoint.methods': 'GET|POST',
    },
  })
  public async test(): Promise<string> {
    return `hello from ${this.__microservice?.config.name}`;
  }

  @method({
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'test',
    },
  })
  public async test2(request: HttpRequest): Promise<string> {
    return `Current time at ${request.url} is ${new Date().toLocaleString()}`;
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
      dummy: 'hello',
    };
  }
}
