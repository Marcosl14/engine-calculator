import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EngineInformation, PistonMotion } from '../../methods/PistonMotion';
import { CommonModule } from '@angular/common';
import { ResultsCard } from '../../common-components/results-card/results-card';
import { InputCard, InputValidationEmitterI } from '../../common-components/input-card/input-card';
import { ChartDataset, ScatterChart } from '../../common-components/scatter-chart/scatter-chart';

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
  imports: [CommonModule, FormsModule, ResultsCard, ScatterChart, InputCard],
  templateUrl: './piston-kinematics.html',
  styleUrl: './piston-kinematics.css',
})
export class PistonKinematics implements AfterViewInit {
  @ViewChild('positionChart') private positionChart!: ScatterChart;
  @ViewChild('velocityChart') private velocityChart!: ScatterChart;
  @ViewChild('accelerationChart') private accelerationChart!: ScatterChart;
  @ViewChild('volumeChart') private volumeChart!: ScatterChart;

  public engine1Volume: number | null = null;
  public engine2Volume: number | null = null;

  public cilinderDiameterVsStrokeRelation1: number | null = null;
  public cilinderDiameterVsStrokeRelation2: number | null = null;

  public staticCompressionRatio1: number | null = null;
  public staticCompressionRatio2: number | null = null;

  public dynamicCompressionRatio1: number | null = null;
  public dynamicCompressionRatio2: number | null = null;

  public cilinderDiameterVsStrokeRelation1Type: CilinderDiameterVsStrokeRelationType | null = null;
  public cilinderDiameterVsStrokeRelation2Type: CilinderDiameterVsStrokeRelationType | null = null;

  public rodStrokeRatio1: number | null = null;
  public rodStrokeRatio2: number | null = null;
  public rodStrokeRatioCharacteristics1: RodStrokeCharacteristics | null = null;
  public rodStrokeRatioCharacteristics2: RodStrokeCharacteristics | null = null;

  public buttonDisabled: boolean = false;
  public errors: Record<string, boolean> = {};

  engine1: EngineInformation = {
    pistonDiameter: 59,
    stroke: 57.8,
    connectingRodLength: 96,
    pistonOffset: 0,
    combustionChamberVolume: 13,
    engineRPM: 11000,
    intakeValveClosing: 70,
  };

  engine2: EngineInformation = {
    pistonDiameter: 67,
    stroke: 44.82,
    connectingRodLength: 96,
    pistonOffset: 0,
    combustionChamberVolume: 13,
    engineRPM: 11000,
    intakeValveClosing: 68,
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateAndGraph();
    });
  }

  calculateAndGraph(): void {
    const motion1 = new PistonMotion();
    const motion2 = new PistonMotion();

    const data1 = motion1.calculate(this.engine1);
    const data2 = motion2.calculate(this.engine2);

    this.getCilinderDiameterVsStrokeRelation();

    this.getCompressionRatio(data1.volumes, data2.volumes);

    this.getRodStrokeRation();

    const datasets1: ChartDataset[] = [
      {
        label: 'Motor 1',
        data: this.generatePointSets(data1.positions),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Motor 2',
        data: this.generatePointSets(data2.positions),
        borderColor: 'rgb(255, 99, 132)',
      },
    ];
    this.positionChart.update(datasets1);

    const datasets2: ChartDataset[] = [
      {
        label: 'Motor 1',
        data: this.generatePointSets(data1.velocities),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Motor 2',
        data: this.generatePointSets(data2.velocities),
        borderColor: 'rgb(255, 99, 132)',
      },
    ];
    this.velocityChart.update(datasets2);

    const datasets3: ChartDataset[] = [
      {
        label: 'Motor 1',
        data: this.generatePointSets(data1.accelerations),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Motor 2',
        data: this.generatePointSets(data2.accelerations),
        borderColor: 'rgb(255, 99, 132)',
      },
    ];
    this.accelerationChart.update(datasets3);

    const datasets4: ChartDataset[] = [
      {
        label: 'Motor 1',
        data: this.generatePointSets(data1.volumes),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Motor 2',
        data: this.generatePointSets(data2.volumes),
        borderColor: 'rgb(255, 99, 132)',
      },
    ];
    this.volumeChart.update(datasets4);
  }

  private getCompressionRatio(engine1Volumes: number[], engine2Volumes: number[]) {
    this.engine1Volume =
      (Math.PI * (this.engine1.pistonDiameter / 2) ** 2 * this.engine1.stroke) / 1000;
    this.engine2Volume =
      (Math.PI * (this.engine2.pistonDiameter / 2) ** 2 * this.engine2.stroke) / 1000;

    if (this.engine1Volume) {
      this.staticCompressionRatio1 =
        (this.engine1Volume + this.engine1.combustionChamberVolume) /
        this.engine1.combustionChamberVolume;
    }
    if (this.engine2Volume) {
      this.staticCompressionRatio2 =
        (this.engine2Volume + this.engine2.combustionChamberVolume) /
        this.engine2.combustionChamberVolume;
    }

    const engine1DynamicVolume =
      this.engine1Volume - engine1Volumes[this.engine1.intakeValveClosing];
    const engine2DynamicVolume =
      this.engine2Volume - engine2Volumes[this.engine2.intakeValveClosing];

    this.dynamicCompressionRatio1 =
      (engine1DynamicVolume + this.engine1.combustionChamberVolume) /
      this.engine1.combustionChamberVolume;

    this.dynamicCompressionRatio2 =
      (engine2DynamicVolume + this.engine2.combustionChamberVolume) /
      this.engine2.combustionChamberVolume;
  }

  private getRodStrokeRation() {
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
  }

  private getCilinderDiameterVsStrokeRelation() {
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

  validatePositiveNumber = (value: number): string | null => {
    return value > 0 ? null : 'Debe ser un número positivo.';
  };

  onValidaton(event: InputValidationEmitterI) {
    this.errors[event.id] = event.error;

    if (Object.values(this.errors).every((error) => !error)) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }
}
