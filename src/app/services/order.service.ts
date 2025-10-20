import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/comanda-digital';

  constructor(private http: HttpClient) { }

  placeOrder(cartItems: CartItem[], total: number): Observable<Order> {
    const newOrder = {
      items: cartItems,
      total,
      status: 'Pendente',
      timestamp: new Date()
    };
    return this.http.post<Order>(this.apiUrl, newOrder);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  updateOrder(orderId: string, order: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, order);
  }

  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }
}