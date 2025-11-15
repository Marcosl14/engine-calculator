import { OnInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { EngineInformation, PistonMotion } from '../../methods/PistonMotion';
import { CommonModule } from '@angular/common';

enum CilinderDiameterVsStrokeRelationType {
  SQUARED = 'cuadrado',
  UNDER_SQUARED = 'carrera larga',
  OVER_SQUARED = 'carrera corta',
}

@Component({
  selector: 'app-piston-kinematics',
  imports: [CommonModule, FormsModule],
  templateUrl: './piston-kinematics.html',
  styleUrl: './piston-kinematics.css',
})
export class PistonKinematics implements OnInit {
  private positionChart!: Chart;
  private velocityChart!: Chart;
  private accelerationChart!: Chart;
  private volumeChart!: Chart;

  public engine1Volume: number | null = null;
  public engine2Volume: number | null = null;

  public cilinderDiameterVsStrokeRelation1: number | null = null;
  public cilinderDiameterVsStrokeRelation2: number | null = null;

  public cilinderDiameterVsStrokeRelation1Type: CilinderDiameterVsStrokeRelationType | null = null;
  public cilinderDiameterVsStrokeRelation2Type: CilinderDiameterVsStrokeRelationType | null = null;

  private readonly baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Ángulo de giro (grados)' },
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

  engine1: EngineInformation = {
    pistonDiameter: 59,
    stroke: 57.8,
    connectingRodLength: 96,
    pistonOffset: 0,
    combustionChamberVolume: 20,
    engineRPM: 11000,
  };

  engine2: EngineInformation = {
    pistonDiameter: 67,
    stroke: 44.82,
    connectingRodLength: 96,
    pistonOffset: 0,
    combustionChamberVolume: 20,
    engineRPM: 11000,
  };

  ngOnInit(): void {
    this.initializeCharts();
    this.calculateAndGraph();
  }

  private initializeCharts(): void {
    this.positionChart = new Chart('positionChart', {
      type: 'scatter',
      data: { labels: [], datasets: [] },
      options: {
        ...this.baseChartOptions,
        plugins: {
          ...this.baseChartOptions.plugins,
          title: { display: true, text: 'Posición del Pistón vs. Ángulo de Giro' },
        },
        scales: {
          ...this.baseChartOptions.scales,
          y: { title: { display: true, text: 'Posición (mm)' } },
        },
      },
    });

    this.velocityChart = new Chart('velocityChart', {
      type: 'scatter',
      data: { labels: [], datasets: [] },
      options: {
        ...this.baseChartOptions,
        plugins: {
          ...this.baseChartOptions.plugins,
          title: { display: true, text: 'Velocidad del Pistón vs. Ángulo de Giro' },
        },
        scales: {
          ...this.baseChartOptions.scales,
          y: { title: { display: true, text: 'Velocidad (m/s)' } },
        },
      },
    });

    this.accelerationChart = new Chart('accelerationChart', {
      type: 'scatter',
      data: { labels: [], datasets: [] },
      options: {
        ...this.baseChartOptions,
        plugins: {
          ...this.baseChartOptions.plugins,
          title: { display: true, text: 'Aceleración del Pistón vs. Ángulo de Giro' },
        },
        scales: {
          ...this.baseChartOptions.scales,
          y: { title: { display: true, text: 'Aceleración (m/s²)' } },
        },
      },
    });

    this.volumeChart = new Chart('volumeChart', {
      type: 'scatter',
      data: { labels: [], datasets: [] },
      options: {
        ...this.baseChartOptions,
        plugins: {
          ...this.baseChartOptions.plugins,
          title: { display: true, text: 'Volumen del Cilindro vs. Ángulo de Giro' },
        },
        scales: {
          ...this.baseChartOptions.scales,
          y: { title: { display: true, text: 'Volumen (cm³)' } },
        },
      },
    });
  }

  calculateAndGraph(): void {
    const motion1 = new PistonMotion();
    const motion2 = new PistonMotion();

    const data1 = motion1.calculate(this.engine1);
    const data2 = motion2.calculate(this.engine2);

    this.engine1Volume =
      (Math.PI * (this.engine1.pistonDiameter / (2 * 10)) ** 2 * this.engine1.stroke) / 10;
    this.engine2Volume =
      (Math.PI * (this.engine2.pistonDiameter / (2 * 10)) ** 2 * this.engine2.stroke) / 10;

    this.cilinderDiameterVsStrokeRelation1 =
      Math.round((this.engine1.pistonDiameter * 100) / this.engine1.stroke) / 100;
    this.cilinderDiameterVsStrokeRelation2 =
      Math.round((this.engine2.pistonDiameter * 100) / this.engine2.stroke) / 100;

    this.cilinderDiameterVsStrokeRelation1Type = this.getCilinderDiameterVsStrokeRelationType(
      this.cilinderDiameterVsStrokeRelation1
    );
    this.cilinderDiameterVsStrokeRelation2Type = this.getCilinderDiameterVsStrokeRelationType(
      this.cilinderDiameterVsStrokeRelation2
    );

    this.updateChartData(
      this.positionChart,
      this.generatePointSets(data1.positions),
      this.generatePointSets(data2.positions)
    );
    this.updateChartData(
      this.velocityChart,
      this.generatePointSets(data1.velocities),
      this.generatePointSets(data2.velocities)
    );
    this.updateChartData(
      this.accelerationChart,
      this.generatePointSets(data1.accelerations),
      this.generatePointSets(data2.accelerations)
    );
    this.updateChartData(
      this.volumeChart,
      this.generatePointSets(data1.volumes),
      this.generatePointSets(data2.volumes)
    );
  }

  private getCilinderDiameterVsStrokeRelationType(
    cilinderDiameterVsStrokeRelation: number
  ): CilinderDiameterVsStrokeRelationType {
    switch (true) {
      case cilinderDiameterVsStrokeRelation > 1.25:
        return CilinderDiameterVsStrokeRelationType.OVER_SQUARED;
      case cilinderDiameterVsStrokeRelation < 0.75:
        return CilinderDiameterVsStrokeRelationType.UNDER_SQUARED;
      default:
        return CilinderDiameterVsStrokeRelationType.SQUARED;
    }
  }

  private generatePointSets(data: number[]): { x: number; y: number }[] {
    return data.map((value, index) => ({ x: index, y: value }));
  }

  private updateChartData(
    chart: Chart,
    data1: { x: number; y: number }[],
    data2: { x: number; y: number }[]
  ): void {
    chart.data.datasets = [
      {
        label: 'Motor 1',
        data: data1,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        showLine: true,
      },
      {
        label: 'Motor 2',
        data: data2,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        showLine: true,
      },
    ];
    chart.update();
  }
}
