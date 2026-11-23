export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number
  ) {
    if (!productId.trim()) {
      throw new Error('Ідентифікатор товару не може бути порожнім');
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Кількість товару повинна бути додатним цілим числом');
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error('Ціна товару не може бути від’ємною');
    }
  }

  equals(other: OrderItem): boolean {
    return (
      this.productId === other.productId &&
      this.quantity === other.quantity &&
      this.unitPrice === other.unitPrice
    );
  }
}