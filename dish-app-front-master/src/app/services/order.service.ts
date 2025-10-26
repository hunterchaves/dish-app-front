import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Order, OrderStatus, PaymentMethod, OrderRequest, OrderDishRequest } from '../models'; // Import new interfaces
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; // Corrected API URL
  private wsUrl = 'comanda-digital'; // Assuming WebSocket endpoint
  private socket$: WebSocketSubject<Order>;
  public orderUpdates$: Observable<Order>;

  constructor(private http: HttpClient) {
    this.socket$ = webSocket<Order>(this.wsUrl);
    this.orderUpdates$ = this.socket$.asObservable();
  }

  placeOrder(cartItems: CartItem[], paymentMethod: PaymentMethod, paymentDetails: any, observation?: string): Observable<Order> {
    const orderDishRequests: OrderDishRequest[] = cartItems.map(item => ({
      dishId: item.dish.id,
      quantity: item.quantity
    }));

    const orderRequest: OrderRequest = {
      items: orderDishRequests,
      paymentMethod: paymentMethod,
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
    // Send update via HTTP, backend should then push update via WebSocket
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  updateOrder(orderId: string, order: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, order);
  }

  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }

  uploadPhoto(orderId: string, file: File): Observable<Order> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/photo`, formData);
  }
}