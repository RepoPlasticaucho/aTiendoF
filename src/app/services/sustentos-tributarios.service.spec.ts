import { TestBed } from '@angular/core/testing';

import { SustentosTributariosService } from './sustentos-tributarios.service';

describe('SustentosTributariosService', () => {
  let service: SustentosTributariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SustentosTributariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
