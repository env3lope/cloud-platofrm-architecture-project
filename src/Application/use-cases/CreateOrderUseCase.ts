import { randomUUID } from 'node:crypto';

import { Order } from '../../Domain/entities/Order';
import { OrderItem } from '../../Domain/value-objects/OrderItem';
import type { IOrderRepository } from '../../Domain/repositories/IOrderRepository';

import type { CreateOrderDto } from '../dto/CreateOrderDto';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository
  ) { }

  async execute(dto: CreateOrderDto): Promise<Order> {
    const items = dto.items.map(
      (item) => new OrderItem(
        item.productId,
        item.quantity,
        item.unitPrice
      )
    );

    const order = new Order(
      randomUUID(),
      dto.customerId,
      items,
      new Date()
    );

    await this.orderRepository.save(order);

    return order;
  }
}