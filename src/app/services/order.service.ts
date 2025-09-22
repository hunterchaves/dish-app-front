import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { Order, OrderStatus } from '../models';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() { }

  placeOrder(cartItems: CartItem[], total: number): Observable<Order> {
    const newOrder: Order = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      items: cartItems,
      total,
      status: 'Pendente',
      timestamp: new Date()
    };

    const currentOrders = this.ordersSubject.getValue();
    this.ordersSubject.next([...currentOrders, newOrder]);

    // Simulate status changes
    this.simulateOrderStatusChange(newOrder.id);

    return of(newOrder);
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(order => order.id === id))
    );
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const currentOrders = this.ordersSubject.getValue();
    const orderIndex = currentOrders.findIndex(order => order.id === orderId);

    if (orderIndex > -1) {
      currentOrders[orderIndex].status = status;
      this.ordersSubject.next([...currentOrders]);
    }
  }

  private simulateOrderStatusChange(orderId: string): void {
    setTimeout(() => {
      this.updateOrderStatus(orderId, 'Em Preparo');
    }, 5000); // 5 seconds to 'Em Preparo'

    setTimeout(() => {
      this.updateOrderStatus(orderId, 'Saiu para Entrega');
    }, 15000); // 15 seconds to 'Saiu para Entrega'
  }
}