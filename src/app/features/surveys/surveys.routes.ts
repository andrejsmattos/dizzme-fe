import { Routes } from '@angular/router';

export const surveysRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/components/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            '../../core/components/survey-list/survey-list.component'
          ).then((c) => c.SurveyListComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('../../core/components/new-survey/new-survey.component').then(
            (c) => c.NewSurveyComponent
          ),
      },
      {
        path: ':id/view',
        loadComponent: () =>
          import(
            '../../core/components/survey-view/survey-view.component'
          ).then((c) => c.SurveyViewComponent),
      },
      {
        path: ':id/stats',
        loadComponent: () =>
          import(
            '../../core/components/survey-stats/survey-stats.component'
          ).then((c) => c.SurveyStatsComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('../../core/components/new-survey/new-survey.component').then(
            (c) => c.NewSurveyComponent
          ),
      },
    ],
  },
];
