import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dish } from '../models';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() { }

  addToCart(dish: Dish): void {
    console.log(dish);
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(item => item.dish.id === dish.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ dish, quantity: 1 });
    }

    this.itemsSubject.next([...currentItems]);
  }

  removeFromCart(dishId: number): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.dish.id !== dishId);
    this.itemsSubject.next(updatedItems);
  }

  updateQuantity(dishId: number, change: 1 | -1): void {
    const currentItems = this.itemsSubject.getValue();
    const itemToUpdate = currentItems.find(item => item.dish.id === dishId);

    if (itemToUpdate) {
      itemToUpdate.quantity += change;

      if (itemToUpdate.quantity <= 0) {
        this.removeFromCart(dishId);
      } else {
        this.itemsSubject.next([...currentItems]);
      }
    }
  }

  getCartTotal(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + (item.dish.price * item.quantity), 0))
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getCartItemCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
}
