import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dish-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dish-management.component.html',
  styleUrls: ['./dish-management.component.css']
})
export class DishManagementComponent implements OnInit {
  dishes$!: Observable<Dish[]>;

  constructor(private dishService: DishService) { }

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes(): void {
    this.dishes$ = this.dishService.getDishes();
  }

  deleteDish(id: number): void {
    if (confirm('Tem certeza que deseja deletar este prato?')) {
      this.dishService.deleteDish(id).subscribe(() => {
        this.loadDishes();
      });
    }
  }
}
