import { Routes } from '@angular/router';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishManagementComponent } from './components/dish-management/dish-management.component';
import { DeliveryViewComponent } from './components/delivery-view/delivery-view.component';
import { KitchenViewComponent } from './components/kitchen-view/kitchen-view.component';

export const routes: Routes = [
  { path: '', component: DishListComponent, pathMatch: 'full' },
  { path: 'cozinha', component: KitchenViewComponent },
  { path: 'entregas', component: DeliveryViewComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'pedido/:id', component: OrderStatusComponent },
  { 
    path: 'admin', 
    children: [
      { path: 'pedidos', component: AdminOrdersComponent },
      { path: 'pratos', component: DishManagementComponent },
      { path: 'pratos/novo', component: DishFormComponent },
      { path: '', redirectTo: 'pedidos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' } // Redirect any other path to home
];