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
  orderStatuses: OrderStatus[] = ['Pendente', 'Em Preparo', 'Pronto para Retirada', 'Saiu para Entrega', 'Entregue', 'Cancelado'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orders$ = this.orderService.getOrders();
  }

  onStatusChange(orderId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as OrderStatus;
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(() => {
      this.loadOrders();
    });
  }

  cancelOrder(orderId: string): void {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.orderService.updateOrderStatus(orderId, 'Cancelado').subscribe(() => {
        this.loadOrders();
      });
    }
  }

  deleteOrder(orderId: string): void {
    if (confirm('Tem certeza que deseja deletar este pedido?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.loadOrders();
      });
    }
  }

  editObservation(order: Order): void {
    const currentObservation = order.observation || '';
    const newObservation = prompt('Digite a observação para este pedido:', currentObservation);

    if (newObservation !== null) { // prompt returns null if user clicks Cancel
      this.orderService.updateOrder(order.id, { observation: newObservation }).subscribe(() => {
        this.loadOrders();
      });
    }
  }
}
