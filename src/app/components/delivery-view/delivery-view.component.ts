import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-view.component.html',
  styleUrls: ['./delivery-view.component.css']
})
export class DeliveryViewComponent implements OnInit {
  orders$!: Observable<Order[]>;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders$ = this.orderService.getOrders().pipe(
      map(orders => orders
        .filter(order => order.status === 'Pronto para Retirada')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      )
    );
  }

  confirmDelivery(order: Order): void {
    this.orderService.updateOrderStatus(order.id, 'Entregue').subscribe(() => {
      this.loadOrders();
    });
  }
}