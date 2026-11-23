import { OrderCreatedEvent } from '../../../Events/OrderCreatedEvent';
import type { IEventBus } from '../../../Messaging/IEventBus';
import { InMemoryProcessedEventStore } from '../InMemoryProcessedEventStore';

export class OrderNotificationConsumer {
  private readonly notifiedOrders: string[] = [];

  constructor(
    private readonly eventBus: IEventBus,
    private readonly processedEvents: InMemoryProcessedEventStore
  ) { }

  subscribe(): void {
    this.eventBus.subscribe(
      OrderCreatedEvent,
      async (event) => this.handle(event)
    );
  }

  private async handle(event: OrderCreatedEvent): Promise<void> {
    const processed = await this.processedEvents.executeOnce(
      event.eventId,
      async () => {
        this.notifiedOrders.push(event.orderId);

        console.log(
          `Сповіщення сформовано для замовлення ${event.orderId}`
        );
      }
    );

    if (!processed) return;
  }

  getNotifications(): string[] {
    return [...this.notifiedOrders];
  }
}
