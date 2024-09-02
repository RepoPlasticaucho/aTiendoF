import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoFacturasAlmacenesComponent } from './estado-facturas-almacenes.component';

describe('EstadoFacturasAlmacenesComponent', () => {
  let component: EstadoFacturasAlmacenesComponent;
  let fixture: ComponentFixture<EstadoFacturasAlmacenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoFacturasAlmacenesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoFacturasAlmacenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
