import { container, startConsumers } from './WebAPI/Container';
import { InMemoryEventBus } from './Messaging/InMemoryEventBus';
import { OrderCreatedEvent } from './Events/OrderCreatedEvent';

import { CreateOrderController } from './WebAPI/controllers/CreateOrderController';
import { InventoryReservationConsumer } from './Infrastructure/messaging/consumers/InventoryReservationConsumer';
import { OrderNotificationConsumer } from './Infrastructure/messaging/consumers/OrderNotificationConsumer';


async function main(): Promise<void> {
  startConsumers();

  const eventBus = container.resolve<InMemoryEventBus>('eventBus');

  const inventoryConsumer =
    container.resolve<InventoryReservationConsumer>(
      'inventoryReservationConsumer'
    );

  const notificationConsumer =
    container.resolve<OrderNotificationConsumer>(
      'orderNotificationConsumer'
    );

  const scope = container.createScope();

  try {
    console.log('--- Створення замовлення ---');

    const controller =
      scope.resolve<CreateOrderController>('createOrderController');

    const order = await controller.create({
      customerId: 'customer-1',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          unitPrice: 100
        }
      ]
    });

    await eventBus.waitForIdle();

    console.log('\n--- Перевірка повторної доставки ---');

    const event = new OrderCreatedEvent(
      order.id,
      order.customerId,
      order.totalAmount
    );

    await eventBus.publish(event);
    await eventBus.waitForIdle();

    const reservationsBeforeDuplicate = inventoryConsumer.getReservations().length;

    const notificationsBeforeDuplicate = notificationConsumer.getNotifications().length;

    await eventBus.publish(event);
    await eventBus.waitForIdle();

    console.log('\n--- Результат ---');

    console.log(
      'Кількість резервувань:',
      inventoryConsumer.getReservations().length
    );

    console.log(
      'Кількість сповіщень:',
      notificationConsumer.getNotifications().length
    );

    console.log(
      'Повторна доставка змінила стан резервування:',
      inventoryConsumer.getReservations().length !==
      reservationsBeforeDuplicate
    );

    console.log(
      'Повторна доставка змінила стан сповіщень:',
      notificationConsumer.getNotifications().length !==
      notificationsBeforeDuplicate
    );
  } finally {
    scope.dispose();
  }
}

main().catch((error: unknown) => {
  console.error('Помилка демонстрації:', error);
  process.exitCode = 1;
});
