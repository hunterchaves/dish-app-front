import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MotoboyManagementComponent } from './motoboy-management.component';
import { OrderService } from '../../services/order.service';

describe('MotoboyManagementComponent', () => {
  let component: MotoboyManagementComponent;
  let fixture: ComponentFixture<MotoboyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoboyManagementComponent, HttpClientTestingModule],
      providers: [OrderService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoboyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
