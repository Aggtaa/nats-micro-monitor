import debugThreadsNs from 'debug-threads-ns';

// eslint-disable-next-line @typescript-eslint/ban-types
type Debug = debugThreadsNs.ExtendedDebug & {
}

export const debug: Debug = debugThreadsNs.default('nats-micro');
