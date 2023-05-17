import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TercerosEditComponent } from './terceros-edit.component';

describe('TercerosEditComponent', () => {
  let component: TercerosEditComponent;
  let fixture: ComponentFixture<TercerosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TercerosEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TercerosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
