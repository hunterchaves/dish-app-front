import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../models';

export interface CartItem {
  id: number; // Assuming the backend will assign an ID to the cart item
  dish: Dish;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(dishId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, { dishId, quantity });
  }

  removeFromCart(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
