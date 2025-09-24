import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Dish } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private dishes: Dish[] = [
    {
      id: 1,
      name: 'Feijoada Completa',
      description: 'Uma deliciosa feijoada com tudo que tem direito.',
      price: 45.90,
      imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Feijoada'
    },
    {
      id: 2,
      name: 'Moqueca de Peixe',
      description: 'Tradicional moqueca baiana com peixe fresco, leite de coco e azeite de dendê.',
      price: 55.00,
      imageUrl: 'https://via.placeholder.com/150/3F51B5/FFFFFF?Text=Moqueca'
    },
    {
      id: 3,
      name: 'Picanha na Chapa',
      description: 'Fatias de picanha grelhadas na chapa, acompanhadas de farofa e vinagrete.',
      price: 65.50,
      imageUrl: 'https://via.placeholder.com/150/F44336/FFFFFF?Text=Picanha'
    }
  ];

  constructor() { }

  getDishes(): Observable<Dish[]> {
    return of(this.dishes);
  }

  getDish(id: number): Observable<Dish | undefined> {
    return of(this.dishes.find(d => d.id === id));
  }

  createDish(dish: Omit<Dish, 'id'>): Observable<Dish> {
    const newId = this.dishes.length > 0 ? Math.max(...this.dishes.map(d => d.id)) + 1 : 1;
    const newDish = { ...dish, id: newId };
    this.dishes.push(newDish);
    return of(newDish);
  }
}