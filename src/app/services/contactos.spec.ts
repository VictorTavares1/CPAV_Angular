import { TestBed } from '@angular/core/testing';

import { Contactos } from './contactos';

describe('Contactos', () => {
  let service: Contactos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contactos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
