import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PistonKinematics } from './piston-kinematics/piston-kinematics';

@NgModule({
  declarations: [],
  imports: [CommonModule, PistonKinematics],
  exports: [PistonKinematics],
})
export class PistonAnalysisModule {}
