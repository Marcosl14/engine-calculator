import { SpeedOfSoundCalculator } from './SpeedOfSoundCalculator';

export class TubingResonanceCalculator {
  calculateIntakeLength(
    rpm: number,
    intakeAdvance: number,
    intakeDelay: number,
    harmonic: number,
    celsiusTemperature: number
  ): {
    length: number;
    speedOfSound: number;
  } {
    const totalAngle = intakeAdvance + 180 + intakeDelay;
    const time = totalAngle / (6 * rpm);

    const speedOfSound = new SpeedOfSoundCalculator().calculate(celsiusTemperature, 1.4, 287);

    return {
      length: (speedOfSound * time) / (4 * harmonic),
      speedOfSound: speedOfSound,
    };
  }

  calculateExhaustLength(
    rpm: number,
    exhaustAdvance: number,
    intakeAdvance: number,
    harmonic: number,
    celsiusTemperature: number
  ): {
    length: number;
    speedOfSound: number;
  } {
    const totalAngle = exhaustAdvance + 180 - intakeAdvance;
    const time = totalAngle / (6 * rpm);

    const speedOfSound = new SpeedOfSoundCalculator().calculate(celsiusTemperature, 1.35, 310);

    return {
      length: (speedOfSound * time) / (2 * harmonic),
      speedOfSound: speedOfSound,
    };
  }
}
