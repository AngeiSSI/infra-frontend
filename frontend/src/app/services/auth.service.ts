import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl; // sin slash final

  constructor(private http: HttpClient) {
    console.log('🔐 [AUTH SERVICE] Inicializado');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response?.token) sessionStorage.setItem('auth_token', response.token);
        if (response?.usuario) sessionStorage.setItem('auth_usuario', JSON.stringify(response.usuario));
      })
    );
  }

  recuperarPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/recuperar-password`, { email });
  }

  resetearPassword(token: string, nueva_password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/resetear-password`, { token, nueva_password });
  }

  cambiarPasswordPrimeraVez(nueva_password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/cambiar-password-primera-vez`, { nueva_password });
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  getUsuario(): any {
    const usuarioJson = sessionStorage.getItem('auth_usuario');
    return usuarioJson ? JSON.parse(usuarioJson) : null;
  }

  isPrimeraVez(): boolean {
    const usuario = this.getUsuario();
    return usuario?.primeraVez === true;
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_usuario');
  }
}