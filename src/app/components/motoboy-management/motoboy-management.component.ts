import { Component, OnInit } from '@angular/core';
import { Order } from '../../models';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-motoboy-management',
  templateUrl: './motoboy-management.component.html',
  styleUrls: ['./motoboy-management.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MotoboyManagementComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(orders => {
      console.log('Loaded orders for motoboy:', orders);
      console.log('Orders with total:', orders.map(order => ({ id: order.id, total: order.totalPrice })));
      this.orders = orders.filter(order => order.status === 'READY_FOR_DELIVERY' || order.status === 'OUT_FOR_DELIVERY');
    });
  }

  markAsOutForDelivery(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'OUT_FOR_DELIVERY').subscribe(() => {
      this.loadOrders();
    });
  }

  markAsDelivered(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'DELIVERED').subscribe(() => {
      this.loadOrders();
    });
  }
}