import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiametricsFee3Component } from './diametrics-fee3.component';

describe('DiametricsFee3Component', () => {
  let component: DiametricsFee3Component;
  let fixture: ComponentFixture<DiametricsFee3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiametricsFee3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiametricsFee3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
