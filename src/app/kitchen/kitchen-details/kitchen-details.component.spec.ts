import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenDetailsComponent } from './kitchen-details.component';

describe('KitchenDetailsComponent', () => {
  let component: KitchenDetailsComponent;
  let fixture: ComponentFixture<KitchenDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
