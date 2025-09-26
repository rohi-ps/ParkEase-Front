import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAdmin } from './billing-admin';

describe('BillingAdmin', () => {
  let component: BillingAdmin;
  let fixture: ComponentFixture<BillingAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
