import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus, PaymentMethod, OrderRequest, OrderDishRequest } from '../models'; // Import new interfaces
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/comanda-digital'; // Corrected API URL

  constructor(private http: HttpClient) {}

  placeOrder(cartItems: CartItem[], paymentMethod: PaymentMethod, paymentDetails: any, observation?: string): Observable<Order> {
    const orderDishRequests: OrderDishRequest[] = cartItems.map(item => ({
      dishId: item.dish.id,
      quantity: item.quantity
    }));

    const orderRequest: OrderRequest = {
      items: orderDishRequests,
      paymentMethod: paymentMethod,
      status: 'PENDING',
      paymentDetails: paymentDetails,
      observation: observation
    };

    return this.http.post<Order>(this.apiUrl, orderRequest);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, {}, { params });
  }

  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }
}