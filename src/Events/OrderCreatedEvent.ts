import { randomUUID } from 'node:crypto';

export class OrderCreatedEvent {
  public readonly eventId: string;
  public readonly occurredAt: string;

  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    eventId: string = randomUUID(),
    occurredAt: string = new Date().toISOString()
  ) {
    this.eventId = eventId;
    this.occurredAt = occurredAt;
  }
}
