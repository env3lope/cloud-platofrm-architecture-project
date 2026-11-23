import type { IEventPublisher } from '../../Application/ports/IEventPublisher';
import type { IEventBus } from '../../Messaging/IEventBus';

export class InMemoryEventPublisher implements IEventPublisher {
  constructor(
    private readonly eventBus: IEventBus
  ) { }

  async publish<T>(event: T): Promise<void> {
    await this.eventBus.publish(event);
  }
}
