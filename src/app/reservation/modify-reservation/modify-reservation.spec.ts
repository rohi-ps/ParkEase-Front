import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyReservation } from './modify-reservation';

describe('ModifyReservation', () => {
  let component: ModifyReservation;
  let fixture: ComponentFixture<ModifyReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyReservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyReservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
