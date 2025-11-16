export class TubingFlowCalculator {
  /**
   * Calculates the intake diameter based on engine parameters.
   * @param rpm - Revolutions per minute.
   * @param pistonDiameter - Diameter of the piston in mm.
   * @param stroke - Stroke length in mm.
   * @param averageGasSpeed - Average gas speed in m/s (75-95).
   * @param volumetricEfficiency - Volumetric efficiency (0.8-1.2).
   * @param valveAmount - Number of intake valves.
   * @returns The calculated intake diameter in meters.
   */
  calculateIntakeDiameter(
    rpm: number,
    pistonDiameter: number,
    stroke: number,
    averageGasSpeed: number,
    volumetricEfficiency: number,
    valveAmount: number
  ): number {
    const cilinderVolume = stroke * Math.PI * Math.pow(pistonDiameter / 2, 2);

    const volumetricFlow = (rpm * volumetricEfficiency * cilinderVolume) / 120;

    return 2 * Math.sqrt(volumetricFlow / (250 * Math.PI * averageGasSpeed * valveAmount));
  }

  /**
   * Calculates the exhaust diameter based on engine parameters.
   * @param rpm - Revolutions per minute.
   * @param pistonDiameter - Diameter of the piston in mm.
   * @param stroke - Stroke length in mm.
   * @param averageGasSpeed - Average gas speed in m/s (90-120).
   * @param volumetricEfficiency - Volumetric efficiency (0.8-1.2).
   * @param valveAmount - Number of exhaust valves.
   * @returns The calculated exhaust diameter in meters.
   */
  calculateExhaustDiameter(
    rpm: number,
    pistonDiameter: number,
    stroke: number,
    averageGasSpeed: number,
    volumetricEfficiency: number,
    valveAmount: number
  ): number {
    const cilinderVolume = stroke * Math.PI * Math.pow(pistonDiameter / 2, 2);

    const volumetricFlow = (rpm * volumetricEfficiency * cilinderVolume) / 120;

    return 2 * Math.sqrt(volumetricFlow / (250 * Math.PI * averageGasSpeed * valveAmount));
  }
}
