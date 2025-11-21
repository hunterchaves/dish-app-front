import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
    return this.http.get<Dish[]>(this.apiUrl).pipe(
      tap(dishes => this.dishesSubject.next(dishes))
    );
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`);
  }

  createDish(formData: FormData): Observable<Dish> {
    return this.http.post<Dish>(this.apiUrl, formData).pipe(
      tap(() => this.getDishes().subscribe())
    );
  }

  updateDish(id: number, dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/${id}`, dish).pipe(
      tap(() => this.getDishes().subscribe())
    );
  }

  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getDishes().subscribe())
    );
  }
}