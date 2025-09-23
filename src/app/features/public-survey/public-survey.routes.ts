import { Routes } from '@angular/router';

export const publicSurveyRoutes: Routes = [
  {
    path: '', // A rota vazia (ex: /survey/:publicId)
    // Assumindo que você tenha um componente para a página pública da pesquisa.
    // Se o nome for diferente, ajuste-o.
    loadComponent: () =>
      import('../../core/components/public-survey/public-survey.component').then(
        (c) => c.PublicSurveyComponent
      ),
  },
];
