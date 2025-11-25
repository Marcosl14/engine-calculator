import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputValidations {
  positiveNumberBiggerThanZero(value: number): string | null {
    return value > 0 ? null : 'Debe ser un número mayor que cero.';
  }

  positiveNumberBiggerOrEquaThanZero(value: number): string | null {
    return value > 0 ? null : 'Debe ser un número positivo o igual a cero.';
  }

  integerNumber(value: number): string | null {
    return Number.isInteger(parseFloat(value.toString())) ? null : 'Debe ser un número entero.';
  }

  lessThanOrEqualTo(value: number, max: number): string | null {
    return value <= max ? null : `Debe ser un número menor o igual a ${max}.`;
  }

  greaterThanOrEqualTo(value: number, min: number): string | null {
    return value >= min ? null : `Debe ser un número mayor o igual a ${min}.`;
  }
}
