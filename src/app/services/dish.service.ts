import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Dish } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private apiUrl = 'http://localhost:8080/api/dishes';
  private readonly dishesCacheKey = 'dishes';

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    const cachedDishes = localStorage.getItem(this.dishesCacheKey);
    if (cachedDishes) {
      return of(JSON.parse(cachedDishes));
    }

    return this.http.get<Dish[]>(this.apiUrl).pipe(
      tap(dishes => {
        localStorage.setItem(this.dishesCacheKey, JSON.stringify(dishes));
      })
    );
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`);
  }

  createDish(dish: Omit<Dish, 'id'>): Observable<Dish> {
    return this.http.post<Dish>(this.apiUrl, dish).pipe(
      tap(() => {
        localStorage.removeItem(this.dishesCacheKey);
      })
    );
  }

  updateDish(id: number, dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/${id}`, dish).pipe(
      tap(() => {
        localStorage.removeItem(this.dishesCacheKey);
      })
    );
  }

  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        localStorage.removeItem(this.dishesCacheKey);
      })
    );
  }
}