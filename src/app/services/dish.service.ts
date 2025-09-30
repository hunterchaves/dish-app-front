import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private apiUrl = 'http://localhost:8080/api/dishes';

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.apiUrl);
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`);
  }

  createDish(dish: Omit<Dish, 'id'>): Observable<Dish> {
    return this.http.post<Dish>(this.apiUrl, dish);
  }

  updateDish(id: number, dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/${id}`, dish);
  }

  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}