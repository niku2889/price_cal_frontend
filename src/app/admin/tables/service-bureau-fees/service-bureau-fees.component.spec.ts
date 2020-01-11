import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBureauFeesComponent } from './service-bureau-fees.component';

describe('ServiceBureauFeesComponent', () => {
  let component: ServiceBureauFeesComponent;
  let fixture: ComponentFixture<ServiceBureauFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBureauFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBureauFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
