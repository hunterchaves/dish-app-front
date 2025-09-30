import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders$!: Observable<Order[]>;
  orderStatuses: OrderStatus[] = ['Pendente', 'Em Preparo', 'Saiu para Entrega', 'Entregue'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.getOrders();
  }

  onStatusChange(orderId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as OrderStatus;
    this.orderService.updateOrderStatus(orderId, newStatus);
  }
}
