import { HttpEndpoint } from '@nats-micro-monitor/types';
import { threadContext } from 'debug-threads-ns';
import { Request, Response, NextFunction } from 'express';
import {
  MicroserviceInfo, MethodInfo, Broker, wrapMethod,
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
}

export type Route = {
  path: string,
  methods: string,
  domain: string,
  microservice: string,
  endpoint: string,
}

export class Router {
  private readonly methods: HttpEndpoint[] = [];

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

      for (const method of this.methods) {
        const match = this.matchMethod(req, method);
        if (match) {
          debug.web.thread.info(`${req.method} ${req.originalUrl} request mapped to ${method.microservice.name}.${method.microservice.id} ${method.microserviceEndpoint.name}`);
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

  public get routes(): Route[] {
    const routes = this.methods
      .map((m) => ({
        path: m.path,
        methods: m.methods.join('|'),
        domain: m.domain,
        microservice: m.microservice.name,
        endpoint: m.microserviceEndpoint.name,
      }));

    return routes;
  }

  public serveRoutes(req: Request, res: Response): void {
    res.json(this.routes);
  }

  private matchMethod(req: Request, method: HttpEndpoint): MethodInfo | undefined {
    if ((method.domain ?? '') !== this.domain)
      return undefined;

    if (method.path !== req.path)
      return undefined;

    if (
      !method.methods.includes('ALL')
      && !method.methods.includes(req.method)
    )
      return undefined;

    return method.microserviceEndpoint;
  }

  private forwardToService(req: Request, res: Response, method: MethodInfo) {

    const start = process.hrtime.bigint();

    const replyToSubj = this.broker.createInbox();

    const measureTime = () => Math.floor(Number(process.hrtime.bigint() - start) / 100000) / 10;

    const closeConnection = () => {
      debug.web.thread.info(`Request closed in ${measureTime()}ms`);
      res.end();
    };

    const handler = wrapMethod(
      this.broker,
      (data) => {
        debug.web.thread.info(`Recevied microservice response in ${measureTime()}ms`);
        res.send(data);
        closeConnection();
        this.broker.off(replyToSubj, handler);
      },
      method.subject,
    );
    this.broker.on(replyToSubj, handler);

    const headers = Object.entries(req.headers)
      .map(([k, v]) => ([k, [String(v)]] as [string, string[]]));
    this.broker.send(
      method.subject,
      {

        headers: req.headers,
        body: 'req.body',
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
    this.methods.splice(0);
  }

  public addServiceRoutes(microservice: MicroserviceInfo): void {
    for (const endpoint of microservice.endpoints)
      this.addMethodRoute(microservice, endpoint);
  }

  public addMethodRoute(microservice: MicroserviceInfo, method: MethodInfo): void {
    const endpoint = this.makeEndpoint(microservice, method);
    if (endpoint)
      this.methods.push(endpoint);
  }

  makeEndpoint(
    microservice: MicroserviceInfo,
    microserviceEndpoint: MethodInfo,
  ): HttpEndpoint | undefined {

    const meta = microserviceEndpoint.metadata;

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
      microservice,
      microserviceEndpoint,
      domain,
      path: join('/', microservice.name, path),
      methods,
    };
  }

  public removeServiceRoutes(microservice: MicroserviceInfo): void {
    for (const endpoint of microservice.endpoints)
      this.removeMethodRoute(microservice.id, endpoint);
  }

  public removeMethodRoute(microserviceId: string, method: MethodInfo): void {
    const idx = this.methods.findIndex(
      (m) =>
        m.microservice.id === microserviceId && m.microserviceEndpoint.name === method.name,
    );

    if (idx >= 0)
      this.methods.splice(idx, 1);
  }
}
