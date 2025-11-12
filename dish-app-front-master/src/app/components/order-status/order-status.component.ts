import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
  order$!: Observable<Order | undefined>;
  selectedFile: File | null = null;

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(orderId: string): void {
    if (this.selectedFile) {
      this.orderService.uploadPhoto(orderId, this.selectedFile).subscribe(() => {
        // Refresh the order data to show the new photo
        this.order$ = this.orderService.getOrderById(orderId);
      });
    }
  }
}
