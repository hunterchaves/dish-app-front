import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, take, switchMap, map } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

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
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.getCartTotal();
  }

  placeOrder(): void {
    this.items$.pipe(
      take(1),
      switchMap(items => {
        if (items.length === 0) {
          throw new Error('O carrinho está vazio!');
        }
        return this.total$.pipe(take(1), map(total => ({ items, total })));
      }),
      switchMap(({ items, total }) => this.orderService.placeOrder(items, total))
    ).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/pedido', order.id]);
      },
      error: (err) => alert(err.message)
    });
  }
}