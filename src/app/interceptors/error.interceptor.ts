import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/shared/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        let mensaje = 'Error en la solicitud';

        if (error.status === 401) {
          mensaje = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          mensaje = 'No tienes permiso para acceder a este recurso.';
          this.router.navigate(['/acceso-denegado']);
        } else if (error.status === 404) {
          mensaje = 'Recurso no encontrado.';
        } else if (error.status === 500) {
          mensaje = 'Error del servidor. Por favor, intenta más tarde.';
        } else if (error.error?.mensaje) {
          mensaje = error.error.mensaje;
        } else if (error.error?.error) {
          mensaje = error.error.error;
        }

        this.notificationService.error(mensaje);

        return throwError(() => new Error(mensaje));
      })
    );
  }
}