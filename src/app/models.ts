export enum PaymentMethod {
  Dinheiro = 'CASH',
  Credito = 'CREDIT_CARD',
  Debito = 'DEBIT_CARD',
  Pix = 'PIX'
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  photoUrl?: string;
}

export type OrderStatus = 'PENDING' | 'IN_PREPARATION' | 'READY_FOR_DELIVERY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface Order {
  id: string;
  orderItems: { dish: Dish, quantity: number }[];
  totalPrice: number;
  status: OrderStatus;
  timestamp: Date;
  observation?: string;
  photoUrl?: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: any;
}

// New interfaces for OrderRequest
export interface OrderDishRequest {
  dishId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderDishRequest[];
  paymentMethod: PaymentMethod;
  status?: OrderStatus;
  paymentDetails?: any;
  observation?: string;
}
