import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainceFeeComponent } from './complaince-fee.component';

describe('ComplainceFeeComponent', () => {
  let component: ComplainceFeeComponent;
  let fixture: ComponentFixture<ComplainceFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainceFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainceFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
