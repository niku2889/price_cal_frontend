import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertionComponent } from './convertion.component';

describe('ConvertionComponent', () => {
  let component: ConvertionComponent;
  let fixture: ComponentFixture<ConvertionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
