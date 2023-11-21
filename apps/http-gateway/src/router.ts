import { SubjectHttpRoute } from '@nats-micro-monitor/types';
import { threadContext } from 'debug-threads-ns';
import { Request, Response, NextFunction } from 'express';
import {
  MicroserviceInfo, MethodInfo, Broker, wrapMethod,
  Request as MicroRequest,
} from 'nats-micro';
import { join } from 'path';
import { isUndefined } from 'util';

import { debug } from './debug.js';

export type HttpRequest = {
  domain: string,
  url: string,
  method: string,
  headers: Record<string, string>,
  body: string,
};

export class Router {
  public routes: SubjectHttpRoute[] = [];

  constructor(
    private readonly broker: Broker,
    public readonly domain: string = '',
  ) {
  }

  public async middleware(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      threadContext.init();

      if (req.originalUrl === '/routes.json') {
        this.serveRoutes(req, res);
        return;
      }

      for (const method of this.routes) {
        const match = this.matchMethod(req, method);
        if (!isUndefined(match)) {
          debug.web.thread.info(`${req.method} ${req.originalUrl} request mapped to ${method.microservice} "${method.subject}"`);
          this.forwardToService(req, res, match);
          return;
        }
      }
      debug.web.thread.error(`${req.method} ${req.originalUrl} found no microservice match`);

      if (req.originalUrl === '/') {
        this.serveIndex(req, res);
        return;
      }

      next();
    }
    catch (err) {
      console.error(err);
      res.status(500);
      res.send(JSON.stringify(err));
    }
  }

  public serveIndex(req: Request, res: Response): void {
    res.send(
      `<html><body>
      <div>Welcome to HTTP microservice gateway!</div>
      <div>Go to <a href="/routes.json">/routes.json</a> to review registered routes</div>
      </body></html>`,
    );
  }

  public serveRoutes(req: Request, res: Response): void {
    res.json(this.routes);
  }

  private matchMethod(req: Request, method: SubjectHttpRoute): SubjectHttpRoute | undefined {
    if ((method.domain ?? '') !== this.domain)
      return undefined;

    if (method.path !== req.path)
      return undefined;

    if (
      !method.methods.includes('ALL')
      && !method.methods.includes(req.method)
    )
      return undefined;

    return method;
  }

  private forwardToService(req: Request, res: Response, method: SubjectHttpRoute) {

    const start = process.hrtime.bigint();

    const replyToSubj = this.broker.createInbox();

    const measureTime = () => Math.floor(Number(process.hrtime.bigint() - start) / 100000) / 10;

    const closeConnection = () => {
      debug.web.thread.info(`Request closed in ${measureTime()}ms`);
      res.end();
    };

    const handler = wrapMethod(
      this.broker,
      (rq: MicroRequest<unknown>) => {
        debug.web.thread.info(`Recevied microservice response in ${measureTime()}ms`);
        res.send(rq.data);
        closeConnection();
        this.broker.off(replyToSubj, handler);
      },
      {
        // microservice: 'http-gateway',
        method: 'http-response',
      },
    );
    this.broker.on(replyToSubj, handler);

    const headers = Object.entries(req.headers) as [string, string][];
    this.broker.send(
      method.subject,
      {

        headers: req.headers,
        body: req.body,
        domain: this.domain,
        method: req.method,
        url: req.originalUrl,
      } as HttpRequest,
      {
        headers,
        replyTo: replyToSubj,
      },
    );
  }

  public clearRoutes(): void {
    this.routes = [];
  }

  public addServiceRoutes(microservice: MicroserviceInfo): void {
    this.removeServiceRoutes(microservice.id);
    for (const endpoint of microservice.endpoints)
      this.addMethodRoute(microservice, endpoint);
  }

  public addMethodRoute(microservice: MicroserviceInfo, method: MethodInfo): void {
    this.removeMethodRoute(microservice.id, method.name);
    const route = this.makeRouteFromMeta(microservice, method);
    if (route)
      this.routes.push(route);
  }

  public addRoute(route: SubjectHttpRoute): void {
    this.removeMethodRoute(route.microservice, route.subject);
    this.routes.push(route);
  }

  makeRouteFromMeta(
    microservice: MicroserviceInfo,
    method: MethodInfo,
  ): SubjectHttpRoute | undefined {

    const meta = method.metadata;

    const path = meta?.['nats-micro.v1.http.endpoint.path'];

    if (isUndefined(path))
      return undefined;

    const domain = meta['nats-micro.v1.http.endpoint.domain'];
    const methodsStr = meta['nats-micro.v1.http.endpoint.methods'] ?? '';
    const methods = methodsStr === ''
      ? ['ALL']
      : methodsStr
        .split('|')
        .map((m: string) => m.trim().toUpperCase());

    return {
      microservice: microservice.id,
      subject: method.subject,
      domain,
      path: join('/', microservice.name, path),
      methods,
    };
  }

  public removeServiceRoutes(microserviceId: string): void {
    this.routes = this.routes
      .filter((m) => m.microservice !== microserviceId);
  }

  public removeMethodRoute(microserviceId: string, subject: string): void {
    this.routes = this.routes
      .filter(
        (m) =>
          m.microservice !== microserviceId || m.subject !== subject,
      );
  }
}
