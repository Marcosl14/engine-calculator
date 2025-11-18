import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-input-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-card.html',
  styleUrl: './input-card.css',
})
export class InputCard {
  @Input() label!: string;
  @Input() id!: string;
  @Input() type: string = 'text';
  @Input() options: SelectOption<string | number>[] = [];
  @Input() value: string | number | null | undefined;
  @Input() validationFn?: (value: any) => string | null;
  error?: string;

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() validation: EventEmitter<InputValidationEmitterI> =
    new EventEmitter<InputValidationEmitterI>();

  onValueChange(newValue: any) {
    this.value = newValue;

    if (this.validationFn) {
      this.error = this.validationFn(newValue) ?? undefined;
      this.validation.emit({
        id: this.id,
        error: this.error ? true : false,
      });
      if (this.error) {
        return;
      }
    }

    this.valueChange.emit(newValue);
  }
}

export interface InputValidationEmitterI {
  id: string;
  error: boolean;
}
