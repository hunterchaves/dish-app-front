import { Component, OnInit } from '@angular/core';
import { DishService } from '../../services/dish.service';
import { CartService } from '../../services/cart.service';
import { Dish } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule] // Add FormsModule
})
export class DishListComponent implements OnInit {
  dishes: Dish[] = [];
  filteredDishes: Dish[] = []; // New property for filtered dishes
  searchTerm: string = ''; // New property for search term
  public backendUrl = 'http://localhost:8080';

  constructor(
    private dishService: DishService,
    private cartService: CartService
  ) {
    this.dishService.getDishes().subscribe();
  }

  ngOnInit(): void {
    this.dishService.dishes$.subscribe((data: Dish[]) => {
      this.dishes = data;
      this.filterDishes(); // Initialize filtered dishes
    });
  }

  filterDishes(): void {
    if (!this.searchTerm) {
      this.filteredDishes = [...this.dishes];
    } else {
      this.filteredDishes = this.dishes.filter(dish =>
        dish.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  addToCart(dish: Dish): void {
    this.cartService.addToCart(dish);
    alert(`${dish.name} foi adicionado ao carrinho!`);
  }

  removeDish(dishId: number): void {
    if (confirm('Tem certeza que deseja remover este prato?')) {
      this.dishService.deleteDish(dishId).subscribe({
        next: () => {
          alert('Prato removido com sucesso!');
          // After removing, refresh the dish list and filter
          // The dishService.dishes$ observable will emit the updated list
        },
        error: (err) => {
          console.error('Erro ao remover prato:', err);
          alert('Erro ao remover prato. Verifique o console para mais detalhes.');
        }
      });
    }
  }
}
