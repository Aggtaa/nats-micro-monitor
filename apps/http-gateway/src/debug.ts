import debugThreadsNs from 'debug-threads-ns';

type Debug = debugThreadsNs.ExtendedDebug & {
  web: debugThreadsNs.ExtendedDebug & {
    thread: debugThreadsNs.ExtendedDebug;
  }
}

export const debug: Debug = debugThreadsNs.default('nats-micro');
