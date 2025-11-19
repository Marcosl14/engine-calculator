import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EngineInformation, PistonMotion } from '../../methods/PistonMotion';
import { CommonModule } from '@angular/common';
import { ResultsCard } from '../../common-components/results-card/results-card';
import { InputCard, InputValidationEmitterI } from '../../common-components/input-card/input-card';
import { ChartDataset, ScatterChart } from '../../common-components/scatter-chart/scatter-chart';
import { InputValidations } from '../../common-services/input-validations';

enum StaticCompressionRatioType {
  VERY_LOW = 'muy baja',
  LOW = 'baja',
  MODERATE = 'moderada',
  HIGH = 'alta',
  VERY_HIGH = 'muy alta',
}

enum DynamicCompressionRatioType {
  VERY_LOW = 'muy baja',
  LOW = 'baja',
  MODERATE = 'moderada',
  HIGH = 'alta',
  VERY_HIGH = 'muy alta',
}

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

interface RelationCharacteristics {
  type: string;
  description: string;
}

@Component({
  selector: 'app-piston-kinematics',
  imports: [CommonModule, FormsModule, ResultsCard, ScatterChart, InputCard],
  providers: [InputValidations],
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

  public cilinderDiameterVsStrokeRatio1: number | null = null;
  public cilinderDiameterVsStrokeRatio2: number | null = null;
  public cilinderDiameterVsStrokeRatioCharacteristics1: RelationCharacteristics | null = null;
  public cilinderDiameterVsStrokeRatioCharacteristics2: RelationCharacteristics | null = null;

  public staticCompressionRatio1: number | null = null;
  public staticCompressionRatio2: number | null = null;
  public staticCompressionRatioCharacteristics1: RelationCharacteristics | null = null;
  public staticCompressionRatioCharacteristics2: RelationCharacteristics | null = null;

  public dynamicCompressionRatio1: number | null = null;
  public dynamicCompressionRatio2: number | null = null;
  public dynamicCompressionRatioCharacteristics1: RelationCharacteristics | null = null;
  public dynamicCompressionRatioCharacteristics2: RelationCharacteristics | null = null;

  public rodStrokeRatio1: number | null = null;
  public rodStrokeRatio2: number | null = null;
  public rodStrokeRatioCharacteristics1: RelationCharacteristics | null = null;
  public rodStrokeRatioCharacteristics2: RelationCharacteristics | null = null;

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

  constructor(public inputValidations: InputValidations) {}

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

    this.staticCompressionRatio1 =
      (this.engine1Volume + this.engine1.combustionChamberVolume) /
      this.engine1.combustionChamberVolume;
    this.staticCompressionRatio2 =
      (this.engine2Volume + this.engine2.combustionChamberVolume) /
      this.engine2.combustionChamberVolume;

    this.staticCompressionRatioCharacteristics1 = this.getStaticCompressionRatioCharacteristics(
      this.staticCompressionRatio1
    );
    this.staticCompressionRatioCharacteristics2 = this.getStaticCompressionRatioCharacteristics(
      this.staticCompressionRatio2
    );

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

    this.dynamicCompressionRatioCharacteristics1 = this.getDynamicCompressionRatioCharacteristics(
      this.dynamicCompressionRatio1
    );

    this.dynamicCompressionRatioCharacteristics2 = this.getDynamicCompressionRatioCharacteristics(
      this.dynamicCompressionRatio2
    );
  }

  private getStaticCompressionRatioCharacteristics(ratio: number): RelationCharacteristics {
    if (ratio < 8.0)
      return {
        type: StaticCompressionRatioType.VERY_LOW,
        description: 'Eficiencia pobre, para motores muy forzados o de baja calidad combustible',
      };
    if (ratio < 9.5)
      return {
        type: StaticCompressionRatioType.LOW,
        description: 'Para turbo/supercharging moderado o combustibles de bajo octanaje',
      };
    if (ratio < 11.0)
      return {
        type: StaticCompressionRatioType.MODERATE,
        description: 'Balance eficiencia/seguridad, combustible premium',
      };
    if (ratio < 13.0)
      return {
        type: StaticCompressionRatioType.HIGH,
        description: 'Alta eficiencia térmica, requiere combustible de alto octanaje',
      };
    return {
      type: StaticCompressionRatioType.VERY_HIGH,
      description: 'Motores de competición atmosféricos, combustibles especiales',
    };
  }

  private getDynamicCompressionRatioCharacteristics(ratio: number): RelationCharacteristics {
    if (ratio < 6.5)
      return {
        type: DynamicCompressionRatioType.VERY_LOW,
        description: 'Levas muy agresivas, pobre torque a bajas RPM, riesgo de combustión pobre',
      };
    if (ratio < 7.5)
      return {
        type: DynamicCompressionRatioType.LOW,
        description: 'Para motores de altas RPM, requiere alta compresión estática',
      };
    if (ratio < 8.5)
      return {
        type: DynamicCompressionRatioType.MODERATE,
        description: 'Balance ideal para combustible premium, buen torque medio',
      };
    if (ratio < 9.0)
      return {
        type: DynamicCompressionRatioType.HIGH,
        description: 'Máximo torque a bajas RPM, riesgo de detonación con combustible estándar',
      };
    return {
      type: DynamicCompressionRatioType.VERY_HIGH,
      description: 'Alto riesgo de detonación, requiere combustibles especiales o etanol',
    };
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

  private getRodStrokeRatioCharacteristics(ratio: number): RelationCharacteristics {
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

  private getCilinderDiameterVsStrokeRelation() {
    this.cilinderDiameterVsStrokeRatio1 =
      Math.round((this.engine1.pistonDiameter * 100) / this.engine1.stroke) / 100;
    this.cilinderDiameterVsStrokeRatio2 =
      Math.round((this.engine2.pistonDiameter * 100) / this.engine2.stroke) / 100;

    this.cilinderDiameterVsStrokeRatioCharacteristics1 =
      this.getCilinderDiameterVsStrokeRationCharacteristics(this.cilinderDiameterVsStrokeRatio1);
    this.cilinderDiameterVsStrokeRatioCharacteristics2 =
      this.getCilinderDiameterVsStrokeRationCharacteristics(this.cilinderDiameterVsStrokeRatio2);
  }

  private getCilinderDiameterVsStrokeRationCharacteristics(
    cilinderDiameterVsStrokeRatio: number
  ): RelationCharacteristics {
    switch (true) {
      case cilinderDiameterVsStrokeRatio > 1.05:
        return {
          type: CilinderDiameterVsStrokeRelationType.OVER_SQUARED,
          description: 'Potencia a más altas RPM, área para válvulas grandes',
        };
      case cilinderDiameterVsStrokeRatio < 0.95:
        return {
          type: CilinderDiameterVsStrokeRelationType.UNDER_SQUARED,
          description: 'Alto torque a bajas RPM, límite de RPM reducido',
        };
      default:
        return {
          type: CilinderDiameterVsStrokeRelationType.SQUARED,
          description: 'Balance entre torque y potencia a altas RPM',
        };
    }
  }

  private generatePointSets(data: number[]): { x: number; y: number }[] {
    return data.map((value, index) => ({ x: index, y: value }));
  }

  onValidaton(event: InputValidationEmitterI) {
    this.errors[event.id] = event.error;

    if (Object.values(this.errors).every((error) => !error)) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }
}
