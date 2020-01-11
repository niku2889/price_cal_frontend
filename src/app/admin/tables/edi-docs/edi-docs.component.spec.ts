import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiDocsComponent } from './edi-docs.component';

describe('EdiDocsComponent', () => {
  let component: EdiDocsComponent;
  let fixture: ComponentFixture<EdiDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdiDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdiDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
