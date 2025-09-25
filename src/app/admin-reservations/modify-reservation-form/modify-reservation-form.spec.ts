import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyReservationForm } from './modify-reservation-form';

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
});
