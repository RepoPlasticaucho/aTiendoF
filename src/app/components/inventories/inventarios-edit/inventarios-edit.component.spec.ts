import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosEditComponent } from './inventarios-edit.component';

describe('InventariosEditComponent', () => {
  let component: InventariosEditComponent;
  let fixture: ComponentFixture<InventariosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventariosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
