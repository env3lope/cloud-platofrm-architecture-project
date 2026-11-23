
import { OrderCreatedEvent } from '../../../Events/OrderCreatedEvent';
import type { IEventBus } from '../../../Messaging/IEventBus';
import { InMemoryProcessedEventStore } from '../InMemoryProcessedEventStore';

export class InventoryReservationConsumer {
  private readonly reservedOrders: string[] = [];

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
        this.reservedOrders.push(event.orderId);

        console.log(
          `Товари зарезервовано для замовлення ${event.orderId}`
        );
      }
    );

    if (!processed) return;
  }

  getReservations(): string[] {
    return [...this.reservedOrders];
  }
}
