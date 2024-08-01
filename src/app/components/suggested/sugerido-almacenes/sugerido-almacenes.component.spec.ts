import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugeridoAlmacenesComponent } from './sugerido-almacenes.component';

describe('SugeridoAlmacenesComponent', () => {
  let component: SugeridoAlmacenesComponent;
  let fixture: ComponentFixture<SugeridoAlmacenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugeridoAlmacenesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugeridoAlmacenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
