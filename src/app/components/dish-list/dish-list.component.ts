import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DishService } from '../../services/dish.service';
import { CartService } from '../../services/cart.service';
import { Dish } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class DishListComponent implements OnInit, OnDestroy {
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private dishesSubscription!: Subscription;

  constructor(
    private dishService: DishService,
    private cartService: CartService
  ) {
    this.dishService.getDishes().subscribe();
  }

  ngOnInit(): void {
    this.dishesSubscription = this.dishService.dishes$.subscribe((data: Dish[]) => {
      this.dishes = data;
      this.filterDishes(true);
      this.isLoading = false;
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), // Wait for 300ms after the last event
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe(() => {
      this.filterDishes();
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.dishesSubscription.unsubscribe();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  filterDishes(isInitialLoad = false): void {
    if (!isInitialLoad) {
      this.isLoading = true;
    }

    // Simulate a short delay for a better user experience
    setTimeout(() => {
      if (!this.searchTerm) {
        this.filteredDishes = [...this.dishes];
      } else {
        const lowercasedTerm = this.searchTerm.toLowerCase();
        this.filteredDishes = this.dishes.filter(dish =>
          dish.name.toLowerCase().includes(lowercasedTerm) ||
          dish.description.toLowerCase().includes(lowercasedTerm)
        );
      }
      if (!isInitialLoad) {
        this.isLoading = false;
      }
    }, 200);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterDishes();
  }

  addToCart(dish: Dish): void {
    this.cartService.addToCart(dish);
  }

  removeDish(dishId: number): void {
    if (confirm('Tem certeza que deseja remover este prato?')) {
      this.dishService.deleteDish(dishId).subscribe({
        next: () => {
          alert('Prato removido com sucesso!');
          // Remove o prato das listas locais para atualização imediata da UI
          this.dishes = this.dishes.filter(dish => dish.id !== dishId);
          this.filterDishes();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao remover prato:', err);
          if (err.status === 500 && err.error?.message?.includes('constraint')) {
            alert('Este prato não pode ser removido pois está associado a um pedido ou outra entidade. Verifique e tente novamente.');
          } else {
            alert('Erro ao remover prato. Verifique o console para mais detalhes.');
          }
        }
      });
    }
  }
}