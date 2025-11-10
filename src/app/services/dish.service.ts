import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Dish } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private apiUrl = 'http://localhost:8080/api/dishes';
  private dishesSubject = new BehaviorSubject<Dish[]>([]);
  public dishes$ = this.dishesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(dishes => dishes.map(dish => ({ ...dish, photoUrl: dish.imageUrl }))),
      tap(dishes => this.dishesSubject.next(dishes))
    );
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(dish => ({ ...dish, photoUrl: dish.imageUrl }))
    );
  }

  createDish(dish: Dish): Observable<Dish> {
    const backendDish = { ...dish, imageUrl: dish.photoUrl };
    delete backendDish.photoUrl;

    return this.http.post<Dish>(this.apiUrl, backendDish).pipe(
      tap(() => this.getDishes().subscribe())
    );
  }

  updateDish(id: number, dish: Dish): Observable<Dish> {
    const backendDish = { ...dish, imageUrl: dish.photoUrl };
    delete backendDish.photoUrl;

    return this.http.put<Dish>(`${this.apiUrl}/${id}`, backendDish).pipe(
      tap(() => this.getDishes().subscribe())
    );
  }

  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentDishes = this.dishesSubject.getValue();
        const updatedDishes = currentDishes.filter(dish => dish.id !== id);
        this.dishesSubject.next(updatedDishes);
      })
    );
  }
}