import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommFeesComponent } from './comm-fees.component';

describe('CommFeesComponent', () => {
  let component: CommFeesComponent;
  let fixture: ComponentFixture<CommFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
