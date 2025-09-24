import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSlots } from './parking-slots';

describe('ParkingSlots', () => {
  let component: ParkingSlots;
  let fixture: ComponentFixture<ParkingSlots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSlots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingSlots);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
