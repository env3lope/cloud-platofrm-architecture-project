import { BenchmarkOrder } from "../gen/service";

const order = {
  orderId: "ORD-2026-001",
  customerId: "550e8400-e29b-41d4-a716-446655440001",

  items: [
    {
      productId: "PROD-001",
      productName: "Gaming Laptop",
      quantity: 1,
      unitPrice: 45999.99,
    },
    {
      productId: "PROD-002",
      productName: "Mechanical Keyboard",
      quantity: 2,
      unitPrice: 3499.99,
    },
    {
      productId: "PROD-003",
      productName: "Gaming Mouse",
      quantity: 1,
      unitPrice: 1899.99,
    },
    {
      productId: "PROD-004",
      productName: "Monitor 27 inch",
      quantity: 1,
      unitPrice: 12999.99,
    },
    {
      productId: "PROD-005",
      productName: "Headphones",
      quantity: 1,
      unitPrice: 2799.99,
    },
  ],

  shippingAddress: {
    city: "Kyiv",
    street: "Khreshchatyk",
    building: "1",
    postalCode: "01001",
    country: "Ukraine",
  },

  totalAmount: 80699.94,

  metadata: {
    source: "web",
    currency: "UAH",
    paymentMethod: "card",
    priority: "normal",
  },

  createdAt: {
    seconds: 1794398400,
    nanos: 0,
  },
};

const json = JSON.stringify(order);
const jsonSize = Buffer.byteLength(json, "utf8");

const protobufMessage = BenchmarkOrder.fromJSON(order);
const protobufBytes = BenchmarkOrder.encode(protobufMessage).finish();
const protobufSize = protobufBytes.length;

const efficiency = jsonSize / protobufSize;
const reduction = ((jsonSize - protobufSize) / jsonSize) * 100;

console.log("Порівняння JSON та Protobuf");
console.log(`Розмір JSON: ${jsonSize} байт`);
console.log(`Розмір Protobuf: ${protobufSize} байт`);
console.log(`Ефективність передачі: ${efficiency.toFixed(2)}x`);
console.log(`Зменшення розміру: ${reduction.toFixed(2)}%`);