import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable( )
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private readonly toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro desconhecido.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.statusText) {
          errorMessage = `Erro ${error.status}: ${error.statusText}`;
        }
        this.toastr.error(errorMessage, 'Erro');
        return throwError(() => error);
      })
    );
  }
}
