import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
  { path: '', component: DishListComponent },
  { path: 'add-dish', component: DishFormComponent },
  { path: 'edit-dish/:id', component: DishFormComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'pedido/:id', component: OrderStatusComponent },
    { 
      path: 'admin', 
      children: [
        { path: 'pedidos', component: AdminOrdersComponent },
        { path: 'pratos/novo', component: DishFormComponent },
        { path: '', redirectTo: 'pedidos', pathMatch: 'full' }
      ]
    },
    { path: '**', redirectTo: '' } // Redirect any other path to home
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
};
