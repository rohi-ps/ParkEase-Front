import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyReservationForm } from './modify-reservation-form';
import { Customer } from '../../model/customers';
describe('ModifyReservationForm', () => {
  let component: ModifyReservationForm;
  let fixture: ComponentFixture<ModifyReservationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyReservationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyReservationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should reset ExitDate if difference is more than 10 days', () => {
    component.form.EntryDate = '2025-09-01';
    component.form.ExitDate = '2025-09-20';
    component.checkDateDifference();
    expect(component.form.ExitDate).toBe('');
  });
  
  it('should populate form when customer input changes', () => {
      const mockCustomer = { slotId: 'A1', vehicleType: '2W', vehicleNumber: 'TN12GH3456', entryDate: '2025-09-26', entryTime: '10:00', exitDate: '2025-09-26', exitTime: '12:00' } as Customer;
      component.customer = mockCustomer;
      component.ngOnChanges();
      expect(component.form.slotId).toBe('A1');
      expect(component.form.VehicleType).toBe('2W');
      expect(component.form.vehicleNumber).toBe('TN12GH3456');
    });

});
