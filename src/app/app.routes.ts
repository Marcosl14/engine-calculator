import { Routes } from '@angular/router';
import { PistonKinematics } from './piston-analysis/piston-kinematics/piston-kinematics';
import { TubingResonance } from './tubing-analysis/tubing-resonance/tubing-resonance';

export const routeNames = {
  pistonKinematics: 'piston-kinematics',
  tubingResonance: 'tubing-resonance',
};

export const routes: Routes = [
  { path: '', component: PistonKinematics },
  { path: routeNames.pistonKinematics, component: PistonKinematics },
  { path: routeNames.tubingResonance, component: TubingResonance },
];
