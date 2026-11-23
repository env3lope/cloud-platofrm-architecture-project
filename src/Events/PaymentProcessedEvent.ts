import { randomUUID } from 'node:crypto';

export class PaymentProcessedEvent {
  public readonly eventId: string;
  public readonly occurredAt: string;

  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
    public readonly amount: number,
    public readonly status: 'completed' | 'failed',
    eventId: string = randomUUID(),
    occurredAt: string = new Date().toISOString()
  ) {
    this.eventId = eventId;
    this.occurredAt = occurredAt;
  }
}
