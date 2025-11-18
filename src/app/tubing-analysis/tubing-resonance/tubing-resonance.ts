import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TubingResonanceCalculator } from '../../methods/TubingResonanceCalculator';
import { TubingFlowCalculator } from '../../methods/TubingFlowCalculator';
import { ResultsCard } from '../../common-components/results-card/results-card';
import { ScatterChart } from '../../common-components/scatter-chart/scatter-chart';

@Component({
  selector: 'app-tubing-resonance',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultsCard, ScatterChart],
  templateUrl: './tubing-resonance.html',
  styleUrl: './tubing-resonance.css',
})
export class TubingResonance implements AfterViewInit {
  rpm: number = 11500;
  stroke: number = 57.8;
  pistonDiameter: number = 59;
  volumetricEfficiency: number = 0.95;

  intakeValveOpenning: number = 40;
  intakeValveClosing: number = 70;
  intakeHarmonic: number = 3;
  intakeTemperature: number = 50;
  intakeAverageSpeed: number = 90;
  intakeValveAmount: number = 1;
  intakeValveDiameter: number = 31.5;
  intakeValveStemDiameter: number = 5;
  intakeSeatAngle: number = 45;
  intakeValveSeatInnerDiameterRatio: number = 0.9;

  exhaustValveOpenning: number = 70;
  exhaustHarmonic: number = 2;
  exhaustTemperature: number = 900;
  exhaustAverageSpeed: number = 105;
  exhaustValveAmount: number = 1;
  exhaustValveDiameter: number = 27;
  exhaustValveStemDiameter: number = 5;
  exhaustSeatAngle: number = 45;
  exhaustValveSeatInnerDiameterRatio: number = 0.9;

  intakeLength: number | null = null;
  exhaustLength: number | null = null;
  intakeSoundSpeed: number | null = null;
  exhaustSoundSpeed: number | null = null;
  intakeDiameter: number | null = null;
  exhaustDiameter: number | null = null;

  intakeMaxTheoricalLift: number | null = null;
  exhaustMaxTheoricalLift: number | null = null;

  @ViewChild('intakeFlowChart') intakeFlowChart!: ScatterChart;
  @ViewChild('exhaustFlowChart') exhaustFlowChart!: ScatterChart;

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
      this.intakeValveSeatInnerDiameterRatio * this.intakeValveDiameter,
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
      this.exhaustValveSeatInnerDiameterRatio * this.exhaustValveDiameter,
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
}
