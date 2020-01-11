import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiametricsFees2Component } from './diametrics-fees2.component';

describe('DiametricsFees2Component', () => {
  let component: DiametricsFees2Component;
  let fixture: ComponentFixture<DiametricsFees2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiametricsFees2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiametricsFees2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
