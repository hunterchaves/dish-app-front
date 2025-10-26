import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, withLatestFrom, switchMap } from 'rxjs/operators';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { PaymentMethod } from '../../models'; // Import PaymentMethod
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  selectedPaymentMethod: PaymentMethod = PaymentMethod.Dinheiro; // Initialize
  PaymentMethod = PaymentMethod; // Make enum available in template

  // Properties for card details
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';

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

        let paymentDetails: any = {};
        if (this.selectedPaymentMethod === PaymentMethod.Credito || this.selectedPaymentMethod === PaymentMethod.Debito) {
          paymentDetails = {
            cardNumber: this.cardNumber,
            cardExpiry: this.cardExpiry,
            cardCvv: this.cardCvv
          };
          // Basic validation
          if (!this.cardNumber || !this.cardExpiry || !this.cardCvv) {
            alert('Por favor, preencha todos os dados do cartão.');
            return of(null);
          }
        } else if (this.selectedPaymentMethod === PaymentMethod.Pix) {
          paymentDetails = {
            // In a real scenario, this would be a dynamically generated Pix key or QR code data
            pixKey: 'comidacaseira@gmail.com' // Placeholder
          };
        }

        return this.orderService.placeOrder(items, this.selectedPaymentMethod, paymentDetails);
      })
    ).subscribe(order => {
      if (order) {
        this.cartService.clearCart();
        this.router.navigate(['/pedido', order.id]);
      }
    });
  }
}
