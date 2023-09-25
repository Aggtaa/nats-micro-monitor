import { Health } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
} from 'nats-micro';

import { Coordinator, ServiceAtDir } from './coordinator.js';

const coordinatorMicroserviceStatus = z.object({
  node: z.string(),
  services: z.array(z.custom<ServiceAtDir>()),
});

type CoordinatorMicroserviceStatus = z.infer<typeof coordinatorMicroserviceStatus>;

const startMicroserviceRequest = z.object({
  name: z.string(),
  environment: z.record(z.string(), z.string()).optional(),
});

type StartMicroserviceRequest = z.infer<typeof startMicroserviceRequest>;

const startMicroserviceResponse = z.object({
});

type StartMicroserviceResponse = z.infer<typeof startMicroserviceResponse>;

@microservice({ version: '0.1.0', description: 'Microservice coordinator and runner' })
export class CoordinatorMicroservice {
  public __microservice: Microservice | undefined;

  constructor(public readonly coordinator: Coordinator) {

  }

  @method({ unbalanced: true, subject: '$SRV.REQ.START' })
  public async startMicroservice(
    req: StartMicroserviceRequest,
  ): Promise<StartMicroserviceResponse> {
    console.dir(req);

    await this.coordinator.startByName(req.name, req.environment ?? {});

    return {};
  }

  @method()
  public async health(): Promise<Health> {
    return {
      value: 'green',
    };
  }

  @method()
  public async status(): Promise<CoordinatorMicroserviceStatus> {
    return {
      node: this.coordinator.node,
      services: this.coordinator.services,
    };
  }
}
