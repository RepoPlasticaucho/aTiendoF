import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosCreateComponent } from './inventarios-create.component';

describe('InventariosCreateComponent', () => {
  let component: InventariosCreateComponent;
  let fixture: ComponentFixture<InventariosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventariosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
