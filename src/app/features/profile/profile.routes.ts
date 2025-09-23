import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
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
          import('../../core/components/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
    ],
  },
];
