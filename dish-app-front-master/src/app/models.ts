export enum PaymentMethod {
  Dinheiro = 'Dinheiro',
  Credito = 'Credito',
  Debito = 'Debito',
  Pix = 'Pix'
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  photoUrl?: string;
}

export type OrderStatus = 'Pendente' | 'Em Preparo' | 'Saiu para Entrega' | 'Entregue';

export interface Order {
  id: string;
  items: { dish: Dish, quantity: number }[];
  total: number;
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
  paymentDetails?: any;
  observation?: string;
}
