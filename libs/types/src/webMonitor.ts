import {
  DiscoveredMicroservice, MicroserviceStats, MicroserviceInfo,
} from 'nats-micro';

import { Health } from './health';

export type UserConnection = {
  id: string;
  client: {
    id: number;
    acc: string;
    host: string;
  };
  server: {
    name: string;
    host: string;
    id: string;
    ver: string;
  };
}

export type MonitoredMicroservice = {
  firstFoundAt: DiscoveredMicroservice['firstFoundAt'];
  lastFoundAt: DiscoveredMicroservice['lastFoundAt'];

  info: MicroserviceInfo;

  stats?: MicroserviceStats;

  health?: Health;
  status?: Record<string, unknown>;
  rtt?: number;

  connection?: UserConnection;
}
