import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmFeesComponent } from './pm-fees.component';

describe('PmFeesComponent', () => {
  let component: PmFeesComponent;
  let fixture: ComponentFixture<PmFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
