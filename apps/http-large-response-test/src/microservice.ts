import { Health, HttpRequest } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
  Request, Response,
} from 'nats-micro';

import fs from 'fs';

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
  public index(_req: Request<HttpRequest>, res: Response<string>): void {

    // type Node = {
    //   text: string;
    //   children: Node[];
    // };

    // function addChildren(node: Node, depth: number) {
    //   console.log(depth);
    //   for (let i = 0; i < 10; i++) {
    //     const child: Node = {
    //       text: Math.random().toString().repeat(20), children: [],
    //     };
    //     node.children.push(child);
    //     if (depth < 10)
    //       addChildren(child, depth + 1);
    //   }
    // }

    // const root = {
    //   text: 'root',
    //   children: [],
    // };

    // addChildren(root, 0);

    // res.send(JSON.stringify(root));
    res.send(fs.readFileSync('./file.txt', 'utf8'));
  }

  @method({
    request: z.void(),
    response: z.void(),
  })
  public ep1(_req: Request<void>, res: Response<void>): void {
    res.send(undefined);
  };

  @method({
    request: z.void(),
    response: z.custom<Health>(),
  })
  public health(_req: Request<void>, res: Response<Health>): void {
    res.send({
      value: 'green',
    });
  };

  @method({
    request: z.void(),
    response: z.custom<MicroserviceStatus>(),
  })
  public status(_req: Request<void>, res: Response<MicroserviceStatus>): void {
    res.send({
    });
  }
}
