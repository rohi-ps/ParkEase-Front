import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavAdmin } from './sidenav-admin';

describe('SidenavAdmin', () => {
  let component: SidenavAdmin;
  let fixture: ComponentFixture<SidenavAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
