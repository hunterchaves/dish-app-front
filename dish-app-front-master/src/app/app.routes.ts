import { Routes } from '@angular/router';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { KitchenOrderManagementComponent } from './components/kitchen-order-management/kitchen-order-management.component';

export const routes: Routes = [
  { path: '', component: DishListComponent, pathMatch: 'full' },
  { path: 'carrinho', component: CartComponent },
  { path: 'pedido/:id', component: OrderStatusComponent },
  { 
    path: 'admin', 
    children: [
      { path: 'pratos/novo', component: DishFormComponent },
      { path: 'kitchen-orders', component: KitchenOrderManagementComponent },
      { path: '', redirectTo: 'pratos/novo', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' } // Redirect any other path to home
];