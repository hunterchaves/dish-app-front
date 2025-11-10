import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Dish } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class DishFormComponent {
  dish: Omit<Dish, 'id'> = {
    name: '',
    description: '',
    price: 0,
    photoUrl: ''
  };

  constructor(
    private dishService: DishService,
    private router: Router
  ) {}

  saveDish(): void {
    const dishData = this.dish as Dish;

    this.dishService.createDish(dishData).subscribe({
      next: () => {
        alert('Prato cadastrado com sucesso!');
        this.resetForm();
        // Optionally, navigate the user away from the form
        // this.router.navigate(['/admin/pratos']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao cadastrar prato:', err);
        // The Data truncation error is less likely now, but we keep the handler
        if (err.status === 500 && err.error?.message?.includes('Data truncation')) {
          alert('Erro: A URL da imagem, nome ou descrição são muito longos.');
        } else {
          alert('Ocorreu um erro ao cadastrar o prato. Verifique o console para mais detalhes.');
        }
      }
    });
  }

  resetForm(): void {
    this.dish = { name: '', description: '', price: 0, photoUrl: '' };
  }
}
