import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInventarioClienteComponent } from './all-inventario-cliente.component';

describe('AllInventarioClienteComponent', () => {
  let component: AllInventarioClienteComponent;
  let fixture: ComponentFixture<AllInventarioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInventarioClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInventarioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
