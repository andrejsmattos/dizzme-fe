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

    // 🔒 Define rotas públicas — não recebem Authorization
    const isPublicRequest =
      req.url.includes('/auth/') ||
      req.url.includes('/qr/') ||
      req.url.includes('/surveys/public/') ||
      req.url.includes('/responses/submit') ||
      req.url.includes('/health');

    let clonedRequest = req;

    // ✅ Só adiciona o token se não for rota pública
    if (token && !isPublicRequest) {
      clonedRequest = clonedRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // ✅ Garante Content-Type para POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(clonedRequest.method)) {
      clonedRequest = clonedRequest.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    // ✅ Trata erros 401 sem deslogar em rotas públicas
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isPublicRequest) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
