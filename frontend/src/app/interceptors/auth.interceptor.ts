import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorClass implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Busca el token en sessionStorage con la clave correcta
    const token = sessionStorage.getItem('auth_token');

    console.log('🔐 [INTERCEPTOR] sessionStorage.getItem("auth_token"):', token ? token.substring(0, 30) + '...' : 'NULL');
    console.log('🔐 [INTERCEPTOR] URL:', req.url);

    if (token) {
      console.log('✅ [INTERCEPTOR] Agregando Bearer token al header');
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    console.log('❌ [INTERCEPTOR] NO hay token, enviando SIN autorización');
    return next.handle(req);
  }
}