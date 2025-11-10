import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderStatus } from '../../models';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-kitchen-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-order-management.component.html',
  styleUrls: ['./kitchen-order-management.component.css']
})
export class KitchenOrderManagementComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        console.log('Loaded orders', orders);
        orders.forEach(order => console.log(`Order ${order.id} observation:`, order.observation));
        console.log('Orders with items:', orders.map(order => ({ id: order.id, items: order.orderItems })));
        this.orders = orders.filter(order => order.status === 'PENDING' || order.status === 'IN_PREPARATION' || order.status === 'READY_FOR_DELIVERY');
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
        alert('Não foi possível carregar a lista de pedidos. Ocorreu um erro no servidor.');
      }
    });
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus): void {
    console.log('Updating order status', order, newStatus);
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: updatedOrder => {
        console.log('Order status updated', updatedOrder);
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          if (updatedOrder.status === 'PENDING' || updatedOrder.status === 'IN_PREPARATION' || updatedOrder.status === 'READY_FOR_DELIVERY') {
            this.orders[index] = updatedOrder;
          } else {
            this.orders.splice(index, 1);
          }
        } else {
          this.loadOrders();
        }
      },
      error: err => {
        console.error('Error updating order status:', err);
        alert('Erro ao atualizar o status do pedido.');
      }
    });
  }
}