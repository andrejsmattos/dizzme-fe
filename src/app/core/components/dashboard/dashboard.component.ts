import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { SurveyService } from '../../services/survey.service';
import { DashboardStatsDto } from '../../models/dashboard.model';
import { SurveySummaryDto } from '../../models/survey.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    RouterLink        
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  dashboardStats: DashboardStatsDto | null = null;
  recentSurveys: SurveySummaryDto[] = [];
  isLoadingStats = true;
  isLoadingSurveys = true;

  npsChartData: ChartConfiguration<'doughnut'>['data'] = { datasets: [{ data: [0, 100], backgroundColor: ['#10b981', '#e5e7eb'], borderWidth: 0 }] };
  csatChartData: ChartConfiguration<'doughnut'>['data'] = { datasets: [{ data: [0, 5], backgroundColor: ['#3b82f6', '#e5e7eb'], borderWidth: 0 }] };
  cesChartData: ChartConfiguration<'doughnut'>['data'] = { datasets: [{ data: [0, 7], backgroundColor: ['#f59e0b', '#e5e7eb'], borderWidth: 0 }] };

  npsChartOptions: ChartOptions<'doughnut'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' };
  csatChartOptions: ChartOptions<'doughnut'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' };
  cesChartOptions: ChartOptions<'doughnut'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' };

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly surveyService: SurveyService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadStats();
    this.loadRecentSurveys();
  }

  loadStats(): void {
    this.isLoadingStats = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardStats = response.data;
          this.updateChartData();
        }
      },
      error: (error) => console.error('Error loading dashboard stats:', error),
      complete: () => this.isLoadingStats = false
    });
  }

  loadRecentSurveys(): void {
    this.isLoadingSurveys = true;
    this.surveyService.getMySurveys().subscribe({
      next: (response) => {
        if (response.success) this.recentSurveys = response.data.slice(0, 5);
      },
      error: (error) => console.error('Error loading recent surveys:', error),
      complete: () => this.isLoadingSurveys = false
    });
  }

  updateChartData(): void {
    if (!this.dashboardStats) return;

    const npsValue = Math.max(0, Math.min(100, this.dashboardStats.avgNPS + 100)) / 2;
    this.npsChartData.datasets[0].data = [npsValue, 100 - npsValue];

    this.csatChartData.datasets[0].data = [this.dashboardStats.avgCSAT, 5 - this.dashboardStats.avgCSAT];
    this.cesChartData.datasets[0].data = [this.dashboardStats.avgCES, 7 - this.dashboardStats.avgCES];
  }

  navigateToNewSurvey(): void { this.router.navigate(['/surveys/new']); }
  viewSurvey(surveyId: number): void { this.router.navigate(['/surveys', surveyId, 'view']); }
  viewStats(surveyId: number): void { this.router.navigate(['/surveys', surveyId, 'stats']); }

  getStatusLabel(status: string, active: boolean): string {
    if (!active) return 'Inativa';
    return { DRAFT: 'Rascunho', ACTIVE: 'Ativa', PAUSED: 'Pausada', COMPLETED: 'Finalizada' }[status] || status;
  }
}
