import { OrderItem } from '../value-objects/OrderItem';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export class Order {
  public readonly items: OrderItem[];

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    items: OrderItem[],
    public readonly createdAt: Date,
    public readonly status: OrderStatus = 'pending'
  ) {
    if (!id.trim()) {
      throw new Error('Ідентифікатор замовлення не може бути порожнім');
    }

    if (!customerId.trim()) {
      throw new Error('Ідентифікатор покупця не може бути порожнім');
    }

    if (items.length === 0) {
      throw new Error('Замовлення повинно містити хоча б один товар');
    }

    this.items = [...items];
  }

  get totalAmount(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  }
}