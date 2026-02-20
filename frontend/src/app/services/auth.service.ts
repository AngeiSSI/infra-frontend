import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {
    console.log('🔐 [AUTH SERVICE] Inicializado');
  }

  login(email: string, password: string): Observable<any> {
    console.log('🔐 [AUTH SERVICE] Iniciando login');
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('✅ [AUTH] Login response recibido:', response);
        console.log('💾 [AUTH] Guardando token y usuario en sessionStorage');
        
        if (response.token) {
          sessionStorage.setItem('auth_token', response.token);
        }
        
        if (response.usuario) {
          sessionStorage.setItem('auth_usuario', JSON.stringify(response.usuario));
          console.log('💾 [AUTH] Usuario guardado:', response.usuario);
        }
      })
    );
  }

  recuperarPassword(email: string): Observable<any> {
    console.log('🔐 [AUTH SERVICE] Enviando solicitud de recuperación de contraseña');
    return this.http.post(`${this.API_URL}/recuperar-password`, { email });
  }

  resetearPassword(token: string, nueva_password: string): Observable<any> {
    console.log('🔐 [AUTH SERVICE] Reseteando contraseña con token');
    return this.http.post(`${this.API_URL}/resetear-password`, { token, nueva_password });
  }

  cambiarPasswordPrimeraVez(nueva_password: string): Observable<any> {
    console.log('🔐 [AUTH SERVICE] Cambiando contraseña primera vez');
    return this.http.post(`${this.API_URL}/cambiar-password-primera-vez`, { nueva_password });
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  getUsuario(): any {
    const usuarioJson = sessionStorage.getItem('auth_usuario');
    if (usuarioJson) {
      return JSON.parse(usuarioJson);
    }
    return null;
  }

  isPrimeraVez(): boolean {
    const usuario = this.getUsuario();
    console.log('🔐 [AUTH] isPrimeraVez:', usuario?.primeraVez);
    return usuario?.primeraVez === true;
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    console.log('🚪 [AUTH] Cerrando sesión');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_usuario');
  }
}