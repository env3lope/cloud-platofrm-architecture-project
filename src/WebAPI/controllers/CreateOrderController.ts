import type { CreateOrderDto } from '../../Application/dto/CreateOrderDto';
import { CreateOrderUseCase } from '../../Application/use-cases/CreateOrderUseCase';
import { Order } from '../../Domain/entities/Order';

export class CreateOrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase
  ) { }

  async create(dto: CreateOrderDto): Promise<Order> {
    return this.createOrderUseCase.execute(dto);
  }
}
