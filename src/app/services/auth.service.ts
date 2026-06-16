import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private usuario: any = null;

  constructor(private http: HttpClient) {
    console.log('🔐 [AUTH SERVICE] Inicializado');
    this.usuario = this.getUsuarioDelStorage();
  }

  login(email: string, password: string): Observable<any> {
    console.log('🔐 [LOGIN] Intentando login con:', email);
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('✅ [LOGIN] Respuesta recibida:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          this.usuario = response.usuario;
          console.log('✅ [LOGIN] Token guardado');
        }
      })
    );
  }

  logout() {
    console.log('🚪 [LOGOUT] Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario = null;
  }

  getUsuario() {
    return this.usuario;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAutenticado() {
    return !!localStorage.getItem('token');
  }

  private getUsuarioDelStorage() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}