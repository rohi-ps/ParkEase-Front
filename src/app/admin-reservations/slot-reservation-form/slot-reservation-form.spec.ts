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
});
