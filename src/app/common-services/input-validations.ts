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
}
