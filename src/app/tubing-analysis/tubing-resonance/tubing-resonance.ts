import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TubingResonanceCalculator } from '../../methods/TubingResonanceCalculator';
import { TubingFlowCalculator } from '../../methods/TubingFlowCalculator';
import { ResultsCard } from '../../common-components/results-card/results-card';
import { ScatterChart } from '../../common-components/scatter-chart/scatter-chart';
import {
  InputCard,
  InputValidationEmitterI,
  SelectOption,
} from '../../common-components/input-card/input-card';
import { InputValidations } from '../../common-services/input-validations';

@Component({
  selector: 'app-tubing-resonance',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultsCard, ScatterChart, InputCard],
  providers: [InputValidations],
  templateUrl: './tubing-resonance.html',
  styleUrl: './tubing-resonance.css',
})
export class TubingResonance implements AfterViewInit {
  rpm: number = 10500;
  stroke: number = 57.8;
  pistonDiameter: number = 59;
  volumetricEfficiency: number = 90;

  intakeValveOpenning: number = 40;
  intakeValveClosing: number = 70;
  intakeHarmonic: number = 3;
  intakeTemperature: number = 50;
  intakeAverageSpeed: number = 90;
  intakeValveAmount: number = 1;
  intakeValveDiameter: number = 31.5;
  intakeValveStemDiameter: number = 5;
  intakeSeatAngle: number = 45;
  intakeValveSeatInnerDiameterRatio: number = 90;

  exhaustValveOpenning: number = 70;
  exhaustHarmonic: number = 2;
  exhaustTemperature: number = 900;
  exhaustAverageSpeed: number = 105;
  exhaustValveAmount: number = 1;
  exhaustValveDiameter: number = 27;
  exhaustValveStemDiameter: number = 5;
  exhaustSeatAngle: number = 45;
  exhaustValveSeatInnerDiameterRatio: number = 90;

  intakeLength: number | null = null;
  exhaustLength: number | null = null;
  intakeSoundSpeed: number | null = null;
  exhaustSoundSpeed: number | null = null;
  intakeDiameter: number | null = null;
  exhaustDiameter: number | null = null;

  intakeMaxTheoricalLift: number | null = null;
  exhaustMaxTheoricalLift: number | null = null;

  public buttonDisabled: boolean = false;
  public errors: Record<string, boolean> = {};

  @ViewChild('intakeFlowChart') intakeFlowChart!: ScatterChart;
  @ViewChild('exhaustFlowChart') exhaustFlowChart!: ScatterChart;

  intakeHarmonicOptions: SelectOption<number>[] = [
    { value: 1, label: '1' },
    { value: 3, label: '3' },
    { value: 5, label: '5' },
  ];

  exhaustHarmonicOptions: SelectOption<number>[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  constructor(public inputValidations: InputValidations) {}

  ngAfterViewInit(): void {
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
    this.intakeDiameter = flowCalculator.calculatePortDiameter(
      this.rpm,
      this.pistonDiameter,
      this.stroke,
      this.intakeAverageSpeed,
      this.volumetricEfficiency,
      this.intakeValveAmount
    );

    this.exhaustDiameter = flowCalculator.calculatePortDiameter(
      this.rpm,
      this.pistonDiameter,
      this.stroke,
      this.exhaustAverageSpeed,
      this.volumetricEfficiency,
      this.exhaustValveAmount
    );

    const intakeFlowAreaData = flowCalculator.calculateValveFlowArea(
      this.intakeValveDiameter,
      this.intakeValveStemDiameter,
      (this.intakeValveSeatInnerDiameterRatio * this.intakeValveDiameter) / 100,
      this.intakeSeatAngle
    );

    this.intakeFlowChart.update([
      {
        label: 'Admisión',
        data: intakeFlowAreaData.flowAreas.map(({ lift, surface }) => ({ x: lift, y: surface })),
        borderColor: 'rgb(75, 192, 192)',
      },
    ]);
    this.intakeMaxTheoricalLift = intakeFlowAreaData.maxTheoricalLift;

    const exhaustFlowAreaData = flowCalculator.calculateValveFlowArea(
      this.exhaustValveDiameter,
      this.exhaustValveStemDiameter,
      (this.exhaustValveSeatInnerDiameterRatio * this.exhaustValveDiameter) / 100,
      this.exhaustSeatAngle
    );

    this.exhaustFlowChart.update([
      {
        label: 'Escape',
        data: exhaustFlowAreaData.flowAreas.map(({ lift, surface }) => ({ x: lift, y: surface })),
        borderColor: 'rgb(255, 99, 132)',
      },
    ]);
    this.exhaustMaxTheoricalLift = exhaustFlowAreaData.maxTheoricalLift;
  }

  onValidaton(event: InputValidationEmitterI) {
    this.errors[event.id] = event.error;

    if (Object.values(this.errors).every((error) => !error)) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }

  minVolumetricEfficiency = (value: number): string | null => {
    return this.inputValidations.greaterThanOrEqualTo(value, 50);
  };

  maxVolumetricEfficiency = (value: number): string | null => {
    return this.inputValidations.lessThanOrEqualTo(value, 200);
  };

  minInnerDiameterRatio = (value: number): string | null => {
    return this.inputValidations.greaterThanOrEqualTo(value, 65);
  };

  maxInnerDiameterRatio = (value: number): string | null => {
    return this.inputValidations.lessThanOrEqualTo(value, 95);
  };
}
