import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservations } from './admin-reservations';

describe('AdminReservations', () => {
  let component: AdminReservations;
  let fixture: ComponentFixture<AdminReservations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservations]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminReservations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return correct status class', () => {
    expect(component.getStatusClass('Upcoming')).toBe('status-upcoming');
    expect(component.getStatusClass('Cancelled')).toBe('status-cancelled');
  });
  it('should return correct status icon', () => {
    expect(component.getStatusIcon('Active')).toBe('fas fa-bolt');
    expect(component.getStatusIcon('Completed')).toBe('fas fa-circle-check');
  });
  it('should mark customer as Cancelled', () => {
    component.customers = [{ id: 1, status: 'Upcoming' }, { id: 2, status: 'Active' }];
    component.deletecustomer(1);
    expect(component.customers[0].status).toBe('Cancelled');
  });
});
