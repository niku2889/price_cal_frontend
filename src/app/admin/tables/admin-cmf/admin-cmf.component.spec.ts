import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCMFComponent } from './admin-cmf.component';

describe('AdminCMFComponent', () => {
  let component: AdminCMFComponent;
  let fixture: ComponentFixture<AdminCMFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCMFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCMFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
