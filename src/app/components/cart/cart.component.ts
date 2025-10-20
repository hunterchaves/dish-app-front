import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items$!: Observable<CartItem[]>;
  total$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.getCartTotal();
  }

  checkout(): void {
    this.router.navigate(['/payment']);
  }

  removeItem(dishId: number): void {
    this.cartService.removeItem(dishId);
  }
}