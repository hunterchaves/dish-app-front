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
  dish: Omit<Dish, 'id' | 'photoUrl'> = {
    name: '',
    description: '',
    price: 0
  };
  selectedFile: File | null = null;

  constructor(
    private dishService: DishService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveDish(): void {
    const formData = new FormData();
    formData.append('name', this.dish.name);
    formData.append('description', this.dish.description);
    formData.append('price', this.dish.price.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.dishService.createDish(formData).subscribe(() => {
      alert('Prato cadastrado com sucesso!');
      // Reset form
      this.dish = { name: '', description: '', price: 0 };
      this.selectedFile = null;
      // Optionally, navigate away
      // this.router.navigate(['/admin/pedidos']);
    });
  }
}
