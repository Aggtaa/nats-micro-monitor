import {
  MicroserviceInfo, MethodInfo,
} from 'nats-micro';

export type HttpRequest<T = unknown> = {
  domain: string,
  url: string,
  method: string,
  headers: Record<string, string>,
  body: T,
};

export type HttpRoute = {
  domain: string,
  path: string,
  methods: string[],
};

export type SubjectHttpRoute = HttpRoute & {
  microservice: string;
  subject: string;
};

export type HttpEndpoint = HttpRoute & {
  microservice: MicroserviceInfo;
  endpoint: MethodInfo;
};

export class StatusError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
