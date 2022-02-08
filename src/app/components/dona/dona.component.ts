import { AfterContentInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, Color } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnChanges, AfterContentInit {
  ngAfterContentInit(){
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: this.data }
      ]

    }
  }
 

  @Input() title: string = 'Sin título';
  @Input() data: number[] = [350, 450, 100];
  @Input( 'labels' ) doughnutChartLabels: string[] = ['Label 1', 'Label 2', 'Label 3'];
  

  public colors: Color[] = [
    '#6857e6',
    '#009fee',
    '#f02059'
  ];

  // public data: number[] = [350, 450, 100];

  // Doughnut
  // public doughnutChartLabels: string[] = this.labels;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: this.data,
        backgroundColor: this.colors
      },
    ]
  };

  ngOnChanges(){
    /* this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: this.data }
      ]

    } */
  }
}
