import { Routes } from '@angular/router';
import { PistonKinematics } from './piston-analysis/piston-kinematics/piston-kinematics';
import { TubingResonance } from './tubing-analysis/tubing-resonance/tubing-resonance';

export const routes: Routes = [
  { path: '', component: PistonKinematics },
  { path: 'piston-kinematics', component: PistonKinematics },
  { path: 'tubing-resonance', component: TubingResonance },
];
