export abstract class MicroserviceInfoCollector<T> {

  private items: Record<string, T> = {};

  public clear(): void {
    this.items = {};
  }

  public abstract collectAll(): void;

  public abstract collect(id: string): void;

  public getById(id: string): T | undefined {
    return this.items[id];
  }

  protected save(id: string, info: T): void {
    this.items[id] = info;
  }
}
