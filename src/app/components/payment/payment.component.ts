import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, withLatestFrom, switchMap } from 'rxjs/operators';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { 
    this.cartItems$ = this.cartService.items$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {}

  placeOrder(): void {
    this.cartItems$.pipe(
      take(1),
      withLatestFrom(this.cartTotal$),
      switchMap(([items, total]) => {
        if (items.length === 0) {
          return of(null);
        }
        return this.orderService.placeOrder(items, total);
      })
    ).subscribe(order => {
      if (order) {
        this.cartService.clearCart();
        this.router.navigate(['/pedido', order.id]);
      }
    });
  }
}
