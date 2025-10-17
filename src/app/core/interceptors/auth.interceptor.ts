import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // 🔓 rotas públicas — não enviam token
    const isPublic =
      req.url.includes('/api/surveys/public') ||
      req.url.includes('/api/qr') ||
      req.url.includes('/api/responses/submit') ||
      req.url.includes('/survey/');

    if (!isPublic && token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // Define Content-Type em métodos com body
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      req = req.clone({
        setHeaders: { 'Content-Type': 'application/json' }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isPublic) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
