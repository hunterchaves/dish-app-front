import { Component, OnInit } from '@angular/core';
import { DishService } from '../../services/dish.service';
import { CartService } from '../../services/cart.service';
import { Dish } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DishListComponent implements OnInit {
  dishes: Dish[] = [];

  constructor(
    private dishService: DishService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.dishService.getDishes().subscribe((data: Dish[]) => {
      this.dishes = data;
    });
  }

  addToCart(dish: Dish): void {
    const observation = prompt(`Deseja adicionar alguma observação para o prato ${dish.name}?`);
    this.cartService.addToCart(dish, observation || undefined);
    alert(`${dish.name} foi adicionado ao carrinho!`);
  }
}
