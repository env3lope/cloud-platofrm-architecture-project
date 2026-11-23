import {
  asClass,
  createContainer,
  InjectionMode
} from 'awilix';

import { CreateOrderUseCase } from '../Application/use-cases/CreateOrderUseCase';
import { InMemoryOrderRepository } from '../Infrastructure/repositories/InMemoryOrderRepository';
import { CreateOrderController } from './controllers/CreateOrderController';

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  orderRepository: asClass(InMemoryOrderRepository).singleton(),
  createOrderUseCase: asClass(CreateOrderUseCase).scoped(),
  createOrderController: asClass(CreateOrderController).transient()
});

export function createRequestScope() {
  return container.createScope();
}
