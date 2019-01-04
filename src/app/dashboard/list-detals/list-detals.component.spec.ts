import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetalsComponent } from './list-detals.component';

describe('ListDetalsComponent', () => {
  let component: ListDetalsComponent;
  let fixture: ComponentFixture<ListDetalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDetalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
