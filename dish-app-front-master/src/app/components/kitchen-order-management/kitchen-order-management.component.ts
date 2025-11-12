import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderStatus } from '../../models';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kitchen-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-order-management.component.html',
  styleUrls: ['./kitchen-order-management.component.css']
})
export class KitchenOrderManagementComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private orderSubscription: Subscription | undefined;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.orderSubscription = this.orderService.orderUpdates$.subscribe(order => {
      this.updateOrderInList(order);
    });
  }

  ngOnDestroy(): void {
    this.orderSubscription?.unsubscribe();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders.filter(order => order.status === 'Pendente' || order.status === 'Em Preparo');
    });
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: updatedOrder => {
        console.log('Order status updated successfully:', updatedOrder);
        // The WebSocket will push the update, so no need to manually update 'orders' array here
      },
      error: err => {
        console.error('Error updating order status:', err);
      }
    });
  }

  private updateOrderInList(updatedOrder: Order): void {
    const index = this.orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    } else if (updatedOrder.status === 'Pendente' || updatedOrder.status === 'Em Preparo') {
      this.orders.push(updatedOrder);
    }
    // Filter out orders that are no longer relevant for the kitchen view
    this.orders = this.orders.filter(order => order.status === 'Pendente' || order.status === 'Em Preparo');
  }
}