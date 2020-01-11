import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcomProcessComponent } from './ecom-process.component';

describe('EcomProcessComponent', () => {
  let component: EcomProcessComponent;
  let fixture: ComponentFixture<EcomProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcomProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcomProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
