import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiametricsFeesComponent } from './diametrics-fees.component';

describe('DiametricsFeesComponent', () => {
  let component: DiametricsFeesComponent;
  let fixture: ComponentFixture<DiametricsFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiametricsFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiametricsFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
