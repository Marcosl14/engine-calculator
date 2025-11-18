import { AfterViewInit, Component, Input } from '@angular/core';
import Chart, { ChartOptions, LayoutPosition } from 'chart.js/auto';

export interface ChartDataset {
  label: string;
  data: { x: number; y: number }[];
  borderColor?: string;
}

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  templateUrl: './scatter-chart.html',
  styleUrls: ['./scatter-chart.css'],
})
export class ScatterChart implements AfterViewInit {
  @Input() chartId!: string;
  @Input() label!: string;
  @Input() title!: string;
  @Input() xLabel!: string;
  @Input() yLabel!: string;
  @Input() legendPosition!: LayoutPosition;

  private chart!: Chart;

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  public update(datasets: ChartDataset[]): void {
    this.chart.data.datasets = datasets.map((dataset) => ({
      ...dataset,
      showLine: true,
    }));
    this.chart.update();
  }

  private initializeChart(): void {
    this.chart = new Chart(this.chartId, {
      type: 'scatter',
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: this.legendPosition || 'top',
          },

          title: { display: true, text: this.title },
        },
        scales: {
          x: {
            title: { display: true, text: this.xLabel },
            position: 'bottom',
          },
          y: { title: { display: true, text: this.yLabel } },
        },
      },
    });
  }
}
