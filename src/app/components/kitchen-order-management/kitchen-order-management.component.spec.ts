import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenOrderManagementComponent } from './kitchen-order-management.component';

describe('KitchenOrderManagementComponent', () => {
  let component: KitchenOrderManagementComponent;
  let fixture: ComponentFixture<KitchenOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenOrderManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
