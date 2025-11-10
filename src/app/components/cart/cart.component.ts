import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, map, take } from 'rxjs';
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

  updateQuantity(dishId: number, change: 1 | -1): void {
    this.cartService.updateQuantity(dishId, change);
  }

  removeFromCart(dishId: number): void {
    this.cartService.removeFromCart(dishId);
  }

  checkout(): void {
    this.total$.pipe(take(1)).subscribe(total => {
      localStorage.setItem('cartTotal', JSON.stringify(total));
      this.router.navigate(['/payment']);
    });
  }
}