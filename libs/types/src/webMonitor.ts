import {
  DiscoveredMicroservice, MicroserviceStats, MicroserviceInfo,
} from 'nats-micro';

import { Health } from './health';

export type MonitoredMicroservice = {
  firstFoundAt: DiscoveredMicroservice['firstFoundAt'];
  lastFoundAt: DiscoveredMicroservice['lastFoundAt'];

  info: MicroserviceInfo;

  stats?: MicroserviceStats;

  health?: Health;
  status?: Record<string, unknown>;
  rtt?: number;
}
