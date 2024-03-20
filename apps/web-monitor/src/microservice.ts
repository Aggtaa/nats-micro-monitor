import { Feature, Health, MonitoredMicroservice } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice, Monitor,
  Broker, Request, Response,
} from 'nats-micro';

import { MicroserviceHealthCollector } from './collectors/health.js';
import { MicroserviceRttCollector } from './collectors/rtt.js';
import { MicroserviceStatsCollector } from './collectors/stats.js';
import { MicroserviceStatusCollector } from './collectors/status.js';
import { debug } from './debug.js';

const statusSchema = z.object({
  dummy: z.string(),
});

type Status = z.infer<typeof statusSchema>;

@microservice({ version: '0.12.0', description: 'Microservice Monitor - backend' })
export class WebMonitorMicroservice {

  public __microservice: Microservice | undefined;

  private broker: Broker;
  public monitor: Monitor;

  private microserviceStats: MicroserviceStatsCollector;
  private microserviceHealth: MicroserviceHealthCollector;
  private microserviceStatus: MicroserviceStatusCollector;
  private microserviceRtt: MicroserviceRttCollector;

  public async start(broker: Broker, monitor: Monitor) {
    this.broker = broker;
    this.monitor = monitor;

    this.microserviceStats = new MicroserviceStatsCollector(this.broker);
    this.microserviceHealth = new MicroserviceHealthCollector(this.broker);
    this.microserviceStatus = new MicroserviceStatusCollector(this.broker);
    this.microserviceRtt = new MicroserviceRttCollector(this.broker);

    this.monitor.on('added', (service) => {
      console.log(`SERVICE ADDED: ${service.name}.${service.id}`);
      this.microserviceStats.collect(service);
      this.microserviceHealth.collect(service);
      this.microserviceStatus.collect(service);
      this.microserviceRtt.collect(service);
    });
    monitor.on('removed', () => {
      // console.log(`SERVICE REMOVED: ${service.name}.${service.id}`);
    });
    // monitor.on('change', (services) => {
    //   console.log(`SERVICES: ${services.map((s) => `${s.name}.${s.id}`)}`);
    // });
  }

  @method({
    request: z.void(),
    response: z.custom<string>(),
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'services.json',
    },
  })
  public async services(_req: Request<void>, res: Response<string>): Promise<void> {
    try {
      const services = this.monitor.services
        .map((ms) => {
          const {
            firstFoundAt, lastFoundAt, connection, ...info
          } = ms;
          const stats = this.microserviceStats?.getById(ms.id);
          const health = this.microserviceHealth?.getById(ms.id);
          const status = this.microserviceStatus?.getById(ms.id);
          const rtt = this.microserviceRtt?.getById(ms.id);

          return {
            firstFoundAt,
            lastFoundAt,
            info,
            stats,
            health,
            status,
            rtt,
            connection,
          } as MonitoredMicroservice;
        });

      services.sort(
        (a, b) => a.info.name.localeCompare(b.info.name) * 100 + a.info.id.localeCompare(b.info.id),
      );

      res.send(JSON.stringify(services));
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }

  @method({
    request: z.void(),
    response: z.custom<string>(),
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'features.json',
    },
  })
  public features(_req: Request<void>, res: Response<string>): void {
    try {
      const features: Feature[] = [];

      for (const service of this.monitor.services) {
        for (const endpoint of service.endpoints) {
          if ('nats.micro.ext.v1.feature' in endpoint.metadata) {
            const paramsStr = endpoint.metadata['nats.micro.ext.v1.feature.params'];
            try {
              features.push({
                feature: endpoint.metadata['nats.micro.ext.v1.feature'],
                params: JSON.parse(paramsStr),
              });
            }
            catch {
              debug.info(`Unable to parse feature params "${paramsStr}" for ${service.name} endpoint ${endpoint.name}`);
            }
          }
        }
      }

      features.sort(
        (a, b) => a.feature.localeCompare(b.feature),
      );

      res.send(JSON.stringify(features));
    }
    catch (err) {
      console.error(err);
      throw err;
    }
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
    response: z.custom<Status>(),
  })
  public status(_req: Request<void>, res: Response<Status>): void {
    res.send({
      dummy: 'hello',
    });
  }
}
