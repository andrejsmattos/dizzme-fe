import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { SurveyStatsDto } from '../../models/survey.model';

@Component({
  selector: 'app-survey-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survey-stats.component.html',
  styleUrls: ['./survey-stats.component.scss'],
})
export class SurveyStatsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly surveyService = inject(SurveyService);

  surveyId: number | null = null;
  surveyStats: SurveyStatsDto | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.surveyId = +id;
        this.loadSurveyStats();
      }
    });
  }

  loadSurveyStats(): void {
    if (!this.surveyId) return;

    this.isLoading = true;
    this.surveyService.getSurveyStats(this.surveyId).subscribe({
      next: (response) => {
        if (response.success) {
          this.surveyStats = response.data;
        }
      },
      error: (error) =>
        console.error('Erro ao carregar as estatísticas:', error),
      complete: () => (this.isLoading = false),
    });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
