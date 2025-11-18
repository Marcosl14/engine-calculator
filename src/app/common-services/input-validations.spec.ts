import { TestBed } from '@angular/core/testing';

import { InputValidations } from './input-validations';

describe('InputValidations', () => {
  let service: InputValidations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputValidations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
