import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, take, switchMap } from 'rxjs';
import { CartService, Cart } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart>;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
  }

  placeOrder(): void {
    this.cart$.pipe(
      take(1),
      switchMap(cart => {
        if (!cart || cart.items.length === 0) {
          throw new Error('O carrinho está vazio!');
        }
        return this.orderService.placeOrder(cart.items, cart.total);
      }),
      switchMap(order => this.cartService.clearCart().pipe(
        // Return the order object after clearing the cart
        switchMap(() => this.router.navigate(['/pedido', order.id]))
      ))
    ).subscribe({
      error: (err) => alert(err.message)
    });
  }
}
