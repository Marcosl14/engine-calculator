import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResonanceTuningCalculator } from '../../methods/ResonanceTuningCalculator';

@Component({
  selector: 'app-tubing-resonance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tubing-resonance.html',
  styleUrl: './tubing-resonance.css',
})
export class TubingResonance {
  rpm: number = 11500;
  intakeAdvance: number = 35;
  intakeDelay: number = 60;
  exhaustAdvance: number = 70;
  intakeHarmonic: number = 3;
  exhaustHarmonic: number = 2;
  intakeTemperature: number = 20;
  exhaustTemperature: number = 1050;

  intakeLength: number | null = null;
  exhaustLength: number | null = null;
  intakeSoundSpeed: number | null = null;
  exhaustSoundSpeed: number | null = null;

  calculate(): void {
    const calculator = new ResonanceTuningCalculator();
    const intakeResult = calculator.calculateIntakeLength(
      this.rpm,
      this.intakeAdvance,
      this.intakeDelay,
      this.intakeHarmonic,
      this.intakeTemperature
    );
    this.intakeLength = intakeResult.length * 100;
    this.intakeSoundSpeed = intakeResult.speedOfSound;
    const exhaustResult = calculator.calculateExhaustLength(
      this.rpm,
      this.exhaustAdvance,
      this.intakeAdvance,
      this.exhaustHarmonic,
      this.exhaustTemperature
    );
    this.exhaustLength = exhaustResult.length * 100;
    this.exhaustSoundSpeed = exhaustResult.speedOfSound;
  }
}
