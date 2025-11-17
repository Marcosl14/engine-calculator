import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './results-card.html',
  styleUrl: './results-card.css',
})
export class ResultsCard {
  @Input() title: string | undefined = undefined;
  @Input() value: string | number | undefined | null = undefined;
  @Input() unit: string | undefined = undefined;
  @Input() comment: string | undefined = undefined;
}
