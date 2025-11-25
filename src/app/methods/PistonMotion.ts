export class PistonMotion {
  public calculate(parameters: EngineInformation): EngineMotionData {
    const angles = Array.from({ length: 360 }, (_, i) => i);

    const absolutePositions = angles.map((angle) =>
      this.calculatePistonPosition(angle, parameters)
    );

    const pmiAngle = angles[absolutePositions.indexOf(Math.min(...absolutePositions))];
    const positionAtPMI = this.calculatePistonPosition(pmiAngle, parameters);

    const positions = absolutePositions.map((position) => position - positionAtPMI);

    const velocities = angles.map((angle) => this.calculatePistonVelocity(angle, parameters));

    const accelerations = angles.map((angle) =>
      this.calculatePistonAcceleration(angle, parameters)
    );

    const volumes = angles.map((angle) => this.calculateVolume(angle, parameters, positionAtPMI));
    const minVolume = Math.min(...volumes);

    return {
      angles,
      positions,
      velocities,
      accelerations,
      volumes: volumes.map((volume) => volume - minVolume + parameters.combustionChamberVolume),
    };
  }

  private calculatePistonPosition(angle: number, parameters: EngineInformation): number {
    const { stroke, connectingRodLength, pistonOffset } = parameters;
    const crankRadius = stroke / 2;
    const angleRad = ((angle - 180) * Math.PI) / 180;

    const term1 = crankRadius * Math.cos(angleRad);
    const term2 = Math.sqrt(
      Math.pow(connectingRodLength, 2) -
        Math.pow(crankRadius * Math.sin(angleRad) - pistonOffset, 2)
    );

    return term1 + term2;
  }

  private calculatePistonVelocity(angle: number, parameters: EngineInformation): number {
    const { engineRPM } = parameters;

    const angularVelocity = (engineRPM * 2 * Math.PI) / 60;

    const positionDerivative = this.calculatePositionDerivative(angle, parameters);
    return (positionDerivative * angularVelocity) / 1000;
  }

  private calculatePistonAcceleration(angle: number, parameters: EngineInformation): number {
    const { engineRPM } = parameters;

    const angularVelocity = (engineRPM * 2 * Math.PI) / 60;

    const positionSecondDerivative = this.calculatePositionSecondDerivative(angle, parameters);
    return (positionSecondDerivative * Math.pow(angularVelocity, 2)) / 1000;
  }

  private calculatePositionDerivative(angle: number, parameters: EngineInformation): number {
    const { stroke, connectingRodLength, pistonOffset } = parameters;
    const crankRadius = stroke / 2;
    const angleRad = ((angle - 180) * Math.PI) / 180;

    const sinTheta = Math.sin(angleRad);
    const cosTheta = Math.cos(angleRad);

    const term = crankRadius * sinTheta - pistonOffset;
    const sqrtTerm = Math.sqrt(connectingRodLength * connectingRodLength - term * term);

    const derivative = -crankRadius * sinTheta + (crankRadius * cosTheta * term) / sqrtTerm;

    return derivative;
  }

  private calculatePositionSecondDerivative(angle: number, parameters: EngineInformation): number {
    const { stroke, connectingRodLength, pistonOffset } = parameters;
    const crankRadius = stroke / 2;
    const angleRad = ((angle - 180) * Math.PI) / 180;

    const sinTheta = Math.sin(angleRad);
    const cosTheta = Math.cos(angleRad);

    const term = crankRadius * sinTheta - pistonOffset;
    const sqrtTerm = Math.sqrt(connectingRodLength * connectingRodLength - term * term);
    const sqrtTerm3 = Math.pow(sqrtTerm, 3);

    const secondDerivative =
      -crankRadius * cosTheta +
      (crankRadius * cosTheta * crankRadius * cosTheta) / sqrtTerm +
      (crankRadius * sinTheta * term) / sqrtTerm -
      Math.pow(crankRadius * cosTheta * term, 2) / sqrtTerm3;

    return secondDerivative;
  }

  private calculateVolume(
    angle: number,
    parameters: EngineInformation,
    positionAtPMI: number
  ): number {
    const { pistonDiameter, combustionChamberVolume } = parameters;

    const pistonDiameterCm = pistonDiameter / 10;
    const pistonAreaCm2 = Math.PI * Math.pow(pistonDiameterCm / 2, 2);

    const absolutePosition = this.calculatePistonPosition(angle, parameters);
    const relativePosition = absolutePosition - positionAtPMI;
    const relativePositionCm = relativePosition / 10;

    return combustionChamberVolume + pistonAreaCm2 * relativePositionCm;
  }
}

export interface EngineInformation {
  pistonDiameter: number;
  stroke: number;
  connectingRodLength: number;
  pistonOffset: number;
  combustionChamberVolume: number;
  engineRPM: number;
  intakeValveClosing: number;
  volumetricEfficiency: number;
}

export interface EngineMotionData {
  angles: number[];
  positions: number[];
  velocities: number[];
  accelerations: number[];
  volumes: number[];
}
