import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/components/layout/layout.component').then(c => c.LayoutComponent),
        children: [
          {
            path: '',
        loadComponent: () =>
          import('../../core/components/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
    ],
  },
];

