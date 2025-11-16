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

enum RodStrokeRatioCharacteristicType {
  VERY_SHORT = 'muy corta',
  SHORT = 'corta',
  MODERATE = 'moderada',
  LONG = 'larga',
  VERY_LONG = 'muy larga',
}

interface RodStrokeCharacteristics {
  type: RodStrokeRatioCharacteristicType;
  description: string;
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

  public compressionRatio1: number | null = null;
  public compressionRatio2: number | null = null;

  public cilinderDiameterVsStrokeRelation1Type: CilinderDiameterVsStrokeRelationType | null = null;
  public cilinderDiameterVsStrokeRelation2Type: CilinderDiameterVsStrokeRelationType | null = null;

  public rodStrokeRatio1: number | null = null;
  public rodStrokeRatio2: number | null = null;
  public rodStrokeRatioCharacteristics1: RodStrokeCharacteristics | null = null;
  public rodStrokeRatioCharacteristics2: RodStrokeCharacteristics | null = null;

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
    combustionChamberVolume: 13,
    engineRPM: 11000,
  };

  engine2: EngineInformation = {
    pistonDiameter: 67,
    stroke: 44.82,
    connectingRodLength: 96,
    pistonOffset: 0,
    combustionChamberVolume: 13,
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
      (Math.PI * (this.engine1.pistonDiameter / 2) ** 2 * this.engine1.stroke) / 1000;
    this.engine2Volume =
      (Math.PI * (this.engine2.pistonDiameter / 2) ** 2 * this.engine2.stroke) / 1000;

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

    if (this.engine1Volume) {
      this.compressionRatio1 =
        (this.engine1Volume + this.engine1.combustionChamberVolume) /
        this.engine1.combustionChamberVolume;
    }
    if (this.engine2Volume) {
      this.compressionRatio2 =
        (this.engine2Volume + this.engine2.combustionChamberVolume) /
        this.engine2.combustionChamberVolume;
    }

    this.rodStrokeRatio1 =
      Math.round((this.engine1.connectingRodLength / this.engine1.stroke) * 100) / 100;
    this.rodStrokeRatio2 =
      Math.round((this.engine2.connectingRodLength / this.engine2.stroke) * 100) / 100;

    this.rodStrokeRatioCharacteristics1 = this.getRodStrokeRatioCharacteristics(
      this.rodStrokeRatio1
    );
    this.rodStrokeRatioCharacteristics2 = this.getRodStrokeRatioCharacteristics(
      this.rodStrokeRatio2
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
      case cilinderDiameterVsStrokeRelation > 1.05:
        return CilinderDiameterVsStrokeRelationType.OVER_SQUARED;
      case cilinderDiameterVsStrokeRelation < 0.95:
        return CilinderDiameterVsStrokeRelationType.UNDER_SQUARED;
      default:
        return CilinderDiameterVsStrokeRelationType.SQUARED;
    }
  }

  private getRodStrokeRatioCharacteristics(ratio: number): RodStrokeCharacteristics {
    if (ratio < 1.4)
      return {
        type: RodStrokeRatioCharacteristicType.VERY_SHORT,
        description: 'Alta velocidad pistón, alto desgaste',
      };
    if (ratio < 1.6)
      return {
        type: RodStrokeRatioCharacteristicType.SHORT,
        description: 'Alta potencia, alta aceleración pistón',
      };
    if (ratio < 1.8)
      return { type: RodStrokeRatioCharacteristicType.MODERATE, description: 'Balanceado' };
    if (ratio < 2.0)
      return {
        type: RodStrokeRatioCharacteristicType.LONG,
        description: 'Bajo desgaste, buena eficiencia',
      };
    return {
      type: RodStrokeRatioCharacteristicType.VERY_LONG,
      description: 'Máxima eficiencia, baja velocidad pistón',
    };
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
