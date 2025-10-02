import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Dish } from '../../models';

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
    imageUrl: ''
  };

  constructor(
    private dishService: DishService,
    private router: Router
  ) {}

  saveDish(): void {
    this.dishService.createDish(this.dish).subscribe(() => {
      alert('Prato cadastrado com sucesso!');
      // Reset form
      this.dish = { name: '', description: '', price: 0, imageUrl: '' };
      // Optionally, navigate away
      // this.router.navigate(['/admin/pedidos']);
    });
  }
}