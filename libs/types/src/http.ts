import {
  MicroserviceInfo, MethodInfo,
} from 'nats-micro';

export type HttpRequest = {
  domain: string,
  url: string,
  method: string,
  headers: Record<string, string>,
  body: string,
};

export type HttpEndpoint = {
  microservice: MicroserviceInfo;
  microserviceEndpoint: MethodInfo;
  domain?: string;
  path: string;
  methods: string[];
}
