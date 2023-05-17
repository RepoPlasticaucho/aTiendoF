import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenesegresosComponent } from './almacenesegresos.component';

describe('AlmacenesegresosComponent', () => {
  let component: AlmacenesegresosComponent;
  let fixture: ComponentFixture<AlmacenesegresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacenesegresosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmacenesegresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
