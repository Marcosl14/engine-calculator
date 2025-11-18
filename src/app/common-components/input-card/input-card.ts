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

  @Output() valueChange = new EventEmitter<string | number>();

  onValueChange(newValue: any) {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
