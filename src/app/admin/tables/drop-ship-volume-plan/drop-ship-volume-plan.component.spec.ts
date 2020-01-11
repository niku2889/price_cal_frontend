import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropShipVolumePlanComponent } from './drop-ship-volume-plan.component';

describe('DropShipVolumePlanComponent', () => {
  let component: DropShipVolumePlanComponent;
  let fixture: ComponentFixture<DropShipVolumePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropShipVolumePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropShipVolumePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
