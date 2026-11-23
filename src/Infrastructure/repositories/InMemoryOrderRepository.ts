import { Order } from '../../Domain/entities/Order';
import type { IOrderRepository } from '../../Domain/repositories/IOrderRepository';

export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.orders.push(order);
  }
}
