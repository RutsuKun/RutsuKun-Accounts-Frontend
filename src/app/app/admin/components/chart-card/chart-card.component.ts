import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexLegend,
  ApexTheme,
  ApexGrid,
  ChartComponent,
} from "ng-apexcharts";
type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  theme: ApexTheme;
  grid: ApexGrid;
};
@Component({
  selector: "app-admin-chart-card",
  templateUrl: "./chart-card.component.html",
  styleUrls: ["./chart-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent implements OnInit {
  @Input() color: string;
  @Input() icon = '';
  @Input() value = 0;
  @Input() name = '';
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 0,
          bottom: -15,
          left: 0,
        },
      },
      series: [
        {
          name: "series1",
          data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
        },
      ],
      chart: {
        offsetX: 0,
        offsetY: 0,
        parentHeightOffset: 0,
        height: "140px",
        width: "100%",
        type: "area",
        dropShadow: {
          enabled: false,
        },
        brush: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        selection: {
          enabled: false,
          stroke: {
            color: "red",
          },
        },
        sparkline: {
          enabled: false,
        },
      },
      fill: {
        type: "gradient",
        colors: [this.color],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 80, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: [this.color],
      },
      tooltip: {
        theme: "dark",
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          return (
            '<div class="apexcharts-tooltip-title">' +
            series[seriesIndex][dataPointIndex] +
            "</div>"
          );
        },
      },
      xaxis: {
        tooltip: {
          enabled: false,
        },
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
          strokeWidth: 0,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
        },
      },
      yaxis: {
        tooltip: {
          enabled: false,
        },
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
        },
        show: false,
      },
    };
  }
}
