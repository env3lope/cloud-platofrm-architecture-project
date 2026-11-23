export interface IEventBus {
  publish<T>(event: T): Promise<void>;

  subscribe<T>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>
  ): void;
}
