export class GasDensityCalculator {
  public calculate(pascalsPressure: number, kelvinTemperature: number, R: number): number {
    // ρ_aire = P / (R × T) -> (kg/m³)
    // P -> (Pa -> kg/m2)
    // T (K)
    // R specific gas constant for dry air (approx. \(287.05\text{\ J/(kg}\cdot \text{K)}\))
    return pascalsPressure / (R * kelvinTemperature);
  }
}
