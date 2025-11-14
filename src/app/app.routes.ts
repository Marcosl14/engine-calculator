import { Routes } from '@angular/router';
import { PistonKinematics } from './piston-analysis/piston-kinematics/piston-kinematics';

export const routes: Routes = [
  { path: '', component: PistonKinematics },
  { path: 'piston-kinematics', component: PistonKinematics },
];
