import { Component, OnInit, ViewChild } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from "ng-apexcharts";
import { AuthService } from "../../services/auth.service";

export type ChartOptions = {
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
  markers: ApexMarkers;
  annotations: ApexAnnotations;
};

@Component({
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private auth: AuthService) {
    this.chartOptions = {
      grid: {
        show: false,
      },
      series: [
        {
          name: "series1",
          data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
        },
      ],
      chart: {
        height: 110,
        width: 500,
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
            color: 'red'
          }
        },
        sparkline: {
          enabled: false,
        },
      },
      fill: {
        type: "gradient",
        colors: ["#ffc107"],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#ffc107"],
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

  ngOnInit(): void {}

  logoutLocal() {
    this.auth.logoutLocal();
  }

  logoutSession() {
    this.auth.logout();
  }
}
