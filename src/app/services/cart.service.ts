import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dish } from '../models';

export interface CartItem {
  dish: Dish;
  quantity: number;
  observation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  private observationSubject = new BehaviorSubject<string>('');
  observation$ = this.observationSubject.asObservable();

  constructor() { }

  setObservation(observation: string): void {
    this.observationSubject.next(observation);
  }

  addToCart(dish: Dish, observation?: string): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(item => item.dish.id === dish.id);

    if (existingItem) {
      existingItem.quantity++;
      if (observation) {
        existingItem.observation = observation;
      }
    } else {
      currentItems.push({ dish, quantity: 1, observation });
    }

    this.itemsSubject.next([...currentItems]);
  }

  removeItem(dishId: number): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(item => item.dish.id === dishId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
      } else {
        const index = currentItems.findIndex(item => item.dish.id === dishId);
        currentItems.splice(index, 1);
      }
    }

    this.itemsSubject.next([...currentItems]);
  }

  getCartTotal(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + (item.dish.price * item.quantity), 0))
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.observationSubject.next('');
  }

  getCartItemCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
}