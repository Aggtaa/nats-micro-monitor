import { Health, MonitoredMicroservice } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice, Monitor,
  Broker,
} from 'nats-micro';

import { MicroserviceHealthCollector } from './collectors/health.js';
import { MicroserviceRttCollector } from './collectors/rtt.js';
import { MicroserviceStatsCollector } from './collectors/stats.js';
import { MicroserviceStatusCollector } from './collectors/status.js';

const statusSchema = z.object({
  dummy: z.string(),
});

type Status = z.infer<typeof statusSchema>;

@microservice()
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

    this.monitor.on('added', (service) => {
      console.log(`SERVICE ADDED: ${service.name}.${service.id}`);
    });
    monitor.on('removed', (service) => {
      console.log(`SERVICE REMOVED: ${service.name}.${service.id}`);
    });
    monitor.on('change', (services) => {
      console.log(`SERVICES: ${JSON.stringify(services)}`);
    });
  }

  @method({
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'services.json',
    },
  })
  public async services(): Promise<string> {
    try {
      return JSON.stringify(
        this.monitor.services
          .map((ms) => {
            const { firstFoundAt, lastFoundAt, ...info } = ms;
            const stats = this.microserviceStats.getById(ms.id);
            const health = this.microserviceHealth.getById(ms.id);
            const status = this.microserviceStatus.getById(ms.id);
            const rtt = this.microserviceRtt.getById(ms.id);

            return {
              firstFoundAt,
              lastFoundAt,
              info,
              stats,
              health,
              status,
              rtt,
            } as MonitoredMicroservice;
          }),
      );
    }
    catch (err) {
      console.error(err);
      throw err;
    }
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
