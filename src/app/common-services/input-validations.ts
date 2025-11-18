import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputValidations {
  positiveNumber(value: number): string | null {
    return value >= 0 ? null : 'Debe ser un número positivo.';
  }

  integerNumber(value: number): string | null {
    return Number.isInteger(parseFloat(value.toString())) ? null : 'Debe ser un número entero.';
  }

  biggerThanZero(value: number): string | null {
    return value > 0 ? null : 'Debe ser mayor a cero.';
  }
}
