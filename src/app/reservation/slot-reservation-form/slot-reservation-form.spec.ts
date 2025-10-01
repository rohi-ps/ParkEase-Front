import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlotReservationForm } from './slot-reservation-form';

describe('SlotReservationForm', () => {
  let component: SlotReservationForm;
  let fixture: ComponentFixture<SlotReservationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotReservationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotReservationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form with empty values', () => {
    expect(component.form.slotId).toBe('');
    expect(component.form.vehicleNumber).toBe('');
    expect(component.form.VehicleType).toBe('');
  });
});
