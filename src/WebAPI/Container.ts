import {
  asClass,
  createContainer,
  InjectionMode
} from 'awilix';

import { CreateOrderUseCase } from '../Application/use-cases/CreateOrderUseCase';
import { InMemoryOrderRepository } from '../Infrastructure/repositories/InMemoryOrderRepository';

import { InMemoryEventBus } from '../Messaging/InMemoryEventBus';
import { InMemoryEventPublisher } from '../Infrastructure/messaging/InMemoryEventPublisher';
import { InMemoryProcessedEventStore } from '../Infrastructure/messaging/InMemoryProcessedEventStore';

import { InventoryReservationConsumer } from '../Infrastructure/messaging/consumers/InventoryReservationConsumer';
import { OrderNotificationConsumer } from '../Infrastructure/messaging/consumers/OrderNotificationConsumer';

import { CreateOrderController } from './controllers/CreateOrderController';

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  orderRepository: asClass(InMemoryOrderRepository).singleton(),
  eventBus: asClass(InMemoryEventBus).singleton(),
  eventPublisher: asClass(InMemoryEventPublisher).singleton(),
  processedEvents: asClass(InMemoryProcessedEventStore).transient(),
  inventoryReservationConsumer: asClass(InventoryReservationConsumer).singleton(),
  orderNotificationConsumer: asClass(OrderNotificationConsumer).singleton(),
  createOrderUseCase: asClass(CreateOrderUseCase).scoped(),
  createOrderController: asClass(CreateOrderController).transient()
});

export function createRequestScope() {
  return container.createScope();
}

let consumersStarted = false;

export function startConsumers(): void {
  if (consumersStarted) return;

  container.resolve<InventoryReservationConsumer>(
    'inventoryReservationConsumer'
  ).subscribe();

  container.resolve<OrderNotificationConsumer>(
    'orderNotificationConsumer'
  ).subscribe();

  consumersStarted = true;
}
