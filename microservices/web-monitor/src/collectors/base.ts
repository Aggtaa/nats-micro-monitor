import { MicroserviceInfo } from 'nats-micro';

export abstract class MicroserviceInfoCollector<T> {

  private items: Record<string, T> = {};

  public clear(): void {
    this.items = {};
  }

  protected abstract collectAll(): void;

  public abstract collect(service: MicroserviceInfo): void;

  public getById(id: string): T | undefined {
    return this.items[id];
  }

  protected save(id: string, info: T): void {
    this.items[id] = info;
  }
}
