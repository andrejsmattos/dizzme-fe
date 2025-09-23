import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            '../../core/components/admin-dashboard/admin-dashboard.component'
          ).then((c) => c.AdminDashboardComponent),
      },
    ],
  },
];
