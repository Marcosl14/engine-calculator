export class TubingFlowCalculator {
  /**
   * Calculates the port diameter based on engine parameters.
   * @param rpm - Revolutions per minute.
   * @param pistonDiameter - Diameter of the piston in mm.
   * @param stroke - Stroke length in mm.
   * @param averageGasSpeed - Average gas speed in m/s (75-95).
   * @param volumetricEfficiency - Volumetric efficiency (80-120 %).
   * @param valveAmount - Number of valves.
   * @returns The calculated diameter in milimeters.
   */
  calculatePortDiameter(
    rpm: number,
    pistonDiameter: number,
    stroke: number,
    averageGasSpeed: number,
    volumetricEfficiency: number,
    valveAmount: number
  ): number {
    console.log(rpm, pistonDiameter, stroke, averageGasSpeed, volumetricEfficiency, valveAmount);

    const cilinderVolume = stroke * Math.PI * Math.pow(pistonDiameter / 2, 2);

    const volumetricFlow = (rpm * volumetricEfficiency * cilinderVolume) / 12000;

    return 2 * Math.sqrt(volumetricFlow / (250 * Math.PI * averageGasSpeed * valveAmount));
  }

  private calculateValveSeatFlowArea(
    valveDiameter: number,
    valveSeatInnerDiameter: number,
    valveSeatAngle: number
  ): ValveSeatFlowAreaI[] {
    const valveSeatWidth = (valveDiameter - valveSeatInnerDiameter) / 2;
    const surface: ValveSeatFlowAreaI[] = [];

    for (let lift = 0; lift <= 20; lift += 0.1) {
      const angleRad = (valveSeatAngle * Math.PI) / 180;

      surface.push({
        lift: lift,
        surface:
          Math.PI *
          lift *
          Math.cos(angleRad) *
          (valveDiameter - 2 * valveSeatWidth + (lift * Math.sin(2 * angleRad)) / 2),
      });
    }

    return surface;
  }

  private calculateValveSeatInnerDiameterFlowArea(
    valveSeatInnerDiameter: number,
    valveStemDiameter: number
  ): number {
    const valveStemArea = Math.PI * Math.pow(valveStemDiameter / 2, 2);
    const valveSeatInnerArea = Math.PI * Math.pow(valveSeatInnerDiameter / 2, 2);

    return valveSeatInnerArea - valveStemArea;
  }

  private calculatePortFlowArea(portDiameter: number): number {
    return Math.PI * Math.pow(portDiameter / 2, 2);
  }

  public calculateValveFlowArea(
    valveDiameter: number,
    valveStemDiameter: number,
    valveSeatInnerDiameter: number,
    valveSeatAngle: number
  ): ValveSeatFlowInformationI {
    const valveSeatFlowArea = this.calculateValveSeatFlowArea(
      valveDiameter,
      valveSeatInnerDiameter,
      valveSeatAngle
    );
    const valveSeatInnerFlowArea = this.calculateValveSeatInnerDiameterFlowArea(
      valveSeatInnerDiameter,
      valveStemDiameter
    );

    const portFlowArea = this.calculatePortFlowArea(valveSeatInnerDiameter);

    const limitingArea =
      valveSeatInnerFlowArea < portFlowArea ? valveSeatInnerFlowArea : portFlowArea;
    let maxTheoricalLift = 0;
    let valueFound = false;

    const flowAreas = valveSeatFlowArea.map(({ lift, surface }) => {
      if (surface < limitingArea) {
        return {
          lift: lift,
          surface: surface,
        };
      } else {
        if (!valueFound) {
          maxTheoricalLift = lift;
          valueFound = true;
        }
      }

      return {
        lift: lift,
        surface: limitingArea,
      };
    });

    return {
      flowAreas,
      maxTheoricalLift,
    };
  }
}

export interface ValveSeatFlowInformationI {
  flowAreas: ValveSeatFlowAreaI[];
  maxTheoricalLift: number;
}

export interface ValveSeatFlowAreaI {
  lift: number;
  surface: number;
}
