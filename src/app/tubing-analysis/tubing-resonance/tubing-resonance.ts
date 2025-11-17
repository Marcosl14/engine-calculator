import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TubingResonanceCalculator } from '../../methods/TubingResonanceCalculator';
import { TubingFlowCalculator } from '../../methods/TubingFlowCalculator';

@Component({
  selector: 'app-tubing-resonance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tubing-resonance.html',
  styleUrl: './tubing-resonance.css',
})
export class TubingResonance implements OnInit {
  rpm: number = 11500;
  stroke: number = 57.8;
  pistonDiameter: number = 59;
  volumetricEfficiency: number = 0.95;

  intakeValveOpenning: number = 40;
  intakeValveClosing: number = 70;
  intakeHarmonic: number = 3;
  intakeTemperature: number = 50;
  intakeValveAmount: number = 1;
  intakeAverageSpeed: number = 90;

  exhaustValveOpenning: number = 70;
  exhaustHarmonic: number = 2;
  exhaustTemperature: number = 900;
  exhaustValveAmount: number = 1;
  exhaustAverageSpeed: number = 105;

  intakeLength: number | null = null;
  exhaustLength: number | null = null;
  intakeSoundSpeed: number | null = null;
  exhaustSoundSpeed: number | null = null;
  intakeDiameter: number | null = null;
  exhaustDiameter: number | null = null;

  ngOnInit(): void {
    this.calculate();
  }

  calculate(): void {
    const resonanceCalculator = new TubingResonanceCalculator();
    const intakeResult = resonanceCalculator.calculateIntakeLength(
      this.rpm,
      this.intakeValveOpenning,
      this.intakeValveClosing,
      this.intakeHarmonic,
      this.intakeTemperature
    );
    this.intakeLength = intakeResult.length * 100;
    this.intakeSoundSpeed = intakeResult.speedOfSound;

    const exhaustResult = resonanceCalculator.calculateExhaustLength(
      this.rpm,
      this.exhaustValveOpenning,
      this.intakeValveOpenning,
      this.exhaustHarmonic,
      this.exhaustTemperature
    );
    this.exhaustLength = exhaustResult.length * 100;
    this.exhaustSoundSpeed = exhaustResult.speedOfSound;

    const flowCalculator = new TubingFlowCalculator();
    this.intakeDiameter = flowCalculator.calculateIntakeDiameter(
      this.rpm,
      this.pistonDiameter,
      this.stroke,
      this.intakeAverageSpeed,
      this.volumetricEfficiency,
      this.intakeValveAmount
    );

    this.exhaustDiameter = flowCalculator.calculateExhaustDiameter(
      this.rpm,
      this.pistonDiameter,
      this.stroke,
      this.exhaustAverageSpeed,
      this.volumetricEfficiency,
      this.exhaustValveAmount
    );
  }
}
