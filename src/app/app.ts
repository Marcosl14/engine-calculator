import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PistonAnalysisModule } from './piston-analysis/piston-analysis-module';
import { routeNames } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PistonAnalysisModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Engine-Calculator');
  public routes = routeNames;
  public activeTab = this.routes.pistonKinematics;

  constructor(private router: Router) {}

  goToPistonKinematics() {
    this.router.navigate([`/${this.routes.pistonKinematics}`]);
    this.activeTab = this.routes.pistonKinematics;
  }
  goToTubingResonance() {
    this.router.navigate([`/${this.routes.tubingResonance}`]);
    this.activeTab = this.routes.tubingResonance;
  }
}
