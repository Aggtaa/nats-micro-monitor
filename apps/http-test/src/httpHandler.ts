import { HttpRequest } from '@nats-micro-monitor/types';
import { Request, Response, Middleware } from 'nats-micro';

export function httpHandler():
  [Middleware<HttpRequest, string>[], Middleware<HttpRequest, string>[]] {

  return [
    [
      (req: Request<HttpRequest>, res: Response<string>): void => {

        console.dir('Hello from HTTP Handler middleware');

        // console.dir(req);
        // console.dir(res);

        // res.send('aaa');
        res.send('hello from middleware');
      },
    ],
    [
      (req: Request<HttpRequest>, res: Response<string>): void => {

        console.dir('Hello from HTTP Handler middleware');

        // console.dir(req);
        // console.dir(res);

        // res.send('aaa');
        res.send('hello from middleware');
      },
    ],
  ];
}
