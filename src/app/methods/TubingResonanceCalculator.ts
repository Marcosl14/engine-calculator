import { SpeedOfSoundCalculator } from './SpeedOfSoundCalculator';

export class TubingResonanceCalculator {
  calculateIntakeLength(
    rpm: number,
    intakeValveOpenning: number,
    intakeValveClosing: number,
    harmonic: number,
    celsiusTemperature: number
  ): {
    length: number;
    speedOfSound: number;
  } {
    const totalAngle = intakeValveOpenning + 180 + intakeValveClosing;
    const time = totalAngle / (6 * rpm);

    const speedOfSound = new SpeedOfSoundCalculator().calculate(celsiusTemperature, 1.4, 287);

    return {
      length: (speedOfSound * time) / (4 * harmonic),
      speedOfSound: speedOfSound,
    };
  }

  calculateExhaustLength(
    rpm: number,
    exhaustValveOpenning: number,
    intakeValveOpenning: number,
    harmonic: number,
    celsiusTemperature: number
  ): {
    length: number;
    speedOfSound: number;
  } {
    const totalAngle = exhaustValveOpenning + 180 - intakeValveOpenning;
    const time = totalAngle / (6 * rpm);

    const speedOfSound = new SpeedOfSoundCalculator().calculate(celsiusTemperature, 1.35, 310);

    return {
      length: (speedOfSound * time) / (2 * harmonic),
      speedOfSound: speedOfSound,
    };
  }
}
