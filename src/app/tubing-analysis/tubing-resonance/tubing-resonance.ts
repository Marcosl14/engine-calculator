import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TubingResonanceCalculator } from '../../methods/TubingResonanceCalculator';
import { TubingFlowCalculator } from '../../methods/TubingFlowCalculator';
import { ResultsCard } from '../../common-components/results-card/results-card';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-tubing-resonance',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultsCard],
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

  private intakeFlowChart!: Chart;
  private exhaustFlowChart!: Chart;

  private readonly baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Levante de Válvula (mm)' },
        type: 'linear' as const,
        position: 'bottom' as const,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  ngOnInit(): void {
    this.initializeCharts();
    this.calculate();
  }

  private initializeCharts(): void {
    this.intakeFlowChart = new Chart('intakeFlowChart', {
      type: 'scatter',
      data: { labels: [], datasets: [] },
      options: {
        ...this.baseChartOptions,
        plugins: {
          ...this.baseChartOptions.plugins,
          title: { display: true, text: 'Área de Flujo Válvula de Admisión' },
        },
        scales: {
          ...this.baseChartOptions.scales,
          y: { title: { display: true, text: 'Área (mm²)' } },
        },
      },
    });

    this.exhaustFlowChart = new Chart('exhaustFlowChart', {
      type: 'scatter',
      data: { labels: [], datasets: [] },
      options: {
        ...this.baseChartOptions,
        plugins: {
          ...this.baseChartOptions.plugins,
          title: { display: true, text: 'Área de Flujo Válvula de Escape' },
        },
        scales: {
          ...this.baseChartOptions.scales,
          y: { title: { display: true, text: 'Área (mm²)' } },
        },
      },
    });
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

    const exhaustFlowAreaData = flowCalculator.calculateValveFlowArea(
      this.exhaustValveDiameter,
      this.exhaustValveStemDiameter,
      this.exhaustValveSeatInnerDiameterRatio * this.exhaustValveDiameter,
      this.exhaustSeatAngle
    );

    this.updateChartData(
      this.intakeFlowChart,
      'Admisión',
      intakeFlowAreaData.flowAreas.map(({ lift, surface }) => ({ x: lift, y: surface }))
    );

    this.intakeMaxTheoricalLift = intakeFlowAreaData.maxTheoricalLift;

    this.updateChartData(
      this.exhaustFlowChart,
      'Escape',
      exhaustFlowAreaData.flowAreas.map(({ lift, surface }) => ({ x: lift, y: surface }))
    );

    this.exhaustMaxTheoricalLift = exhaustFlowAreaData.maxTheoricalLift;
  }

  private updateChartData(chart: Chart, label: string, data: { x: number; y: number }[]): void {
    chart.data.datasets = [
      {
        label: label,
        data: data,
        showLine: true,
      },
    ];
    chart.update();
  }
}
