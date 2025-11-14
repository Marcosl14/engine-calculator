import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PistonAnalysisModule } from './piston-analysis/piston-analysis-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PistonAnalysisModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Engine-Calculator');

  constructor(private router: Router) {}

  goToPistonKinematics() {
    this.router.navigate(['/piston-kinematics']);
  }
}
