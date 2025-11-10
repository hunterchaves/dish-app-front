import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
  order$!: Observable<Order | undefined>;

  statusMap: { [key in OrderStatus]: string } = {
    'PENDING': 'Pendente',
    'IN_PREPARATION': 'Em Preparo',
    'READY_FOR_DELIVERY': 'Pronto para Entrega',
    'OUT_FOR_DELIVERY': 'Saiu para Entrega',
    'DELIVERED': 'Entregue'
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.order$ = this.route.paramMap.pipe(
      switchMap(params => {
        const orderId = params.get('id');
        if (orderId) {
          return this.orderService.getOrderById(orderId);
        }
        return new Observable<Order | undefined>();
      })
    );
  }

  translateStatus(status: OrderStatus): string {
    return this.statusMap[status] || status;
  }
}
