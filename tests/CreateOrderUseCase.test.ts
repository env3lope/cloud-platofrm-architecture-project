import { describe, it, expect, vi } from 'vitest';

import { CreateOrderUseCase } from '../src/Application/use-cases/CreateOrderUseCase';
import type { IOrderRepository } from '../src/Domain/repositories/IOrderRepository';
import { Order } from '../src/Domain/entities/Order';

describe('CreateOrderUseCase', () => {
  it('успішно створює та зберігає замовлення', async () => {
    const save = vi.fn().mockResolvedValue(undefined);

    const repository: IOrderRepository = { save };
    const useCase = new CreateOrderUseCase(repository);

    const result = await useCase.execute({
      customerId: 'customer-1',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          unitPrice: 100
        }
      ]
    });

    expect(result).toBeInstanceOf(Order);
    expect(result.totalAmount).toBe(200);
    expect(save).toHaveBeenCalledOnce();
    expect(save).toHaveBeenCalledWith(result);
  });

  it('не зберігає замовлення з некоректними даними', async () => {
    const save = vi.fn().mockResolvedValue(undefined);

    const repository: IOrderRepository = { save };
    const useCase = new CreateOrderUseCase(repository);

    await expect(
      useCase.execute({
        customerId: 'customer-1',
        items: []
      })
    ).rejects.toThrow('Замовлення повинно містити хоча б один товар');

    expect(save).not.toHaveBeenCalled();
  });

  it('передає помилку репозиторію далі', async () => {
    const repositoryError = new Error('Помилка збереження замовлення');
    const save = vi.fn().mockRejectedValue(repositoryError);

    const repository: IOrderRepository = { save };
    const useCase = new CreateOrderUseCase(repository);

    await expect(
      useCase.execute({
        customerId: 'customer-1',
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            unitPrice: 100
          }
        ]
      })
    ).rejects.toBe(repositoryError);

    expect(save).toHaveBeenCalledOnce();
  });
});
