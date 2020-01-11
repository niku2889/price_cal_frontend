import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsKbPlanComponent } from './ms-kb-plan.component';

describe('MsKbPlanComponent', () => {
  let component: MsKbPlanComponent;
  let fixture: ComponentFixture<MsKbPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsKbPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsKbPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
