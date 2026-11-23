import type { IEventBus } from './IEventBus';

type EventHandler<T> = (event: T) => Promise<void>;

export class InMemoryEventBus implements IEventBus {
  private readonly handlers = new Map<
    Function,
    EventHandler<any>[]
  >();

  private readonly pending = new Set<Promise<void>>();

  subscribe<T>(
    eventType: new (...args: any[]) => T,
    handler: EventHandler<T>
  ): void {
    const existingHandlers = this.handlers.get(eventType) ?? [];

    existingHandlers.push(handler);
    this.handlers.set(eventType, existingHandlers);
  }

  async publish<T>(event: T): Promise<void> {
    const eventType = (event as object).constructor;
    const handlers = this.handlers.get(eventType) ?? [];

    for (const handler of handlers) {
      const task = Promise.resolve()
        .then(() => handler(event))
        .catch((error: unknown) => {
          console.error(
            'Помилка під час обробки події:',
            error
          );
        });

      this.pending.add(task);

      void task.then(() => this.pending.delete(task));
    }
  }

  async waitForIdle(): Promise<void> {
    while (this.pending.size > 0) {
      await Promise.all([...this.pending]);
    }
  }
}
