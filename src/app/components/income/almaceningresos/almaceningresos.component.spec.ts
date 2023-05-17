import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmaceningresosComponent } from './almaceningresos.component';

describe('AlmaceningresosComponent', () => {
  let component: AlmaceningresosComponent;
  let fixture: ComponentFixture<AlmaceningresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmaceningresosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmaceningresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
