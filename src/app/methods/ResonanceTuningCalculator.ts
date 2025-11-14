export class ResonanceTuningCalculator {
  calculateIntakeLength(
    rpm: number,
    intakeAdvance: number,
    intakeDelay: number,
    harmonic: number,
    celsiusTemperature: number = 20
  ): {
    length: number;
    speedOfSound: number;
  } {
    const totalAngle = intakeAdvance + 180 + intakeDelay;
    const time = totalAngle / (6 * rpm);

    const speedOfSound = this.calculateSpeedOfSound(celsiusTemperature, 1.4, 287);

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
    celsiusTemperature: number = 700
  ): {
    length: number;
    speedOfSound: number;
  } {
    const totalAngle = exhaustAdvance + 180 - intakeAdvance;
    const time = totalAngle / (6 * rpm);

    const speedOfSound = this.calculateSpeedOfSound(celsiusTemperature, 1.34, 295);

    return {
      length: (speedOfSound * time) / (2 * harmonic),
      speedOfSound: speedOfSound,
    };
  }

  private calculateSpeedOfSound(celsiusTemperature: number, gamma: number, R: number): number {
    // v = √(γ * R * T)
    // T (K)
    return Math.sqrt(gamma * R * (celsiusTemperature + 273));
  }
}
