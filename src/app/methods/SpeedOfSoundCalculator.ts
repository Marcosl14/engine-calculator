export class SpeedOfSoundCalculator {
  public calculate(celsiusTemperature: number, gamma: number, R: number): number {
    // v = sqrt [g * R * T]
    // R = 287.05 J / (kg * ºK) for air
    // gamma = ratio of specific heat (1.4 for air)
    // T (K)
    return Math.sqrt(gamma * R * (celsiusTemperature + 273));
  }
}
