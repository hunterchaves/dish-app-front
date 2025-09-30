import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kitchen-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-view.component.html',
  styleUrls: ['./kitchen-view.component.css']
})
export class KitchenViewComponent implements OnInit {
  orders$!: Observable<Order[]>;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders$ = this.orderService.getOrders().pipe(
      map(orders => orders
        .filter(order => order.status !== 'Entregue') // Filter out delivered orders
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) // Sort by oldest first
      )
    );
  }

  updateStatus(order: Order, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe(() => {
      this.loadOrders();
    });
  }

  getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    switch (currentStatus) {
      case 'Pendente':
        return 'Em Preparo';
      case 'Em Preparo':
        return 'Saiu para Entrega';
      default:
        return null;
    }
  }
}