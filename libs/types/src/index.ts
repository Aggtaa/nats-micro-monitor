export * from './http';

export type Health = {
  value: 'green' | 'yellow' | 'red';
  numericValue?: number;
  reason?: string;
}
