import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingStatus } from './parking-status';

describe('ParkingStatus', () => {
  let component: ParkingStatus;
  let fixture: ComponentFixture<ParkingStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
