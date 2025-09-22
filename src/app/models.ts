export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export type OrderStatus = 'Pendente' | 'Em Preparo' | 'Saiu para Entrega' | 'Entregue';

export interface Order {
  id: string;
  items: { dish: Dish, quantity: number }[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
}
