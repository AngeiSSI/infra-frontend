import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

@Injectable({
  providedIn: 'root'
})
export class AuthService {
<<<<<<< HEAD
  private readonly API_URL = environment.apiUrl; // sin slash final
=======
  private readonly API_URL = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net';
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

  constructor(private http: HttpClient) {
    console.log('🔐 [AUTH SERVICE] Inicializado');
  }

  login(email: string, password: string): Observable<any> {
<<<<<<< HEAD
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response?.token) sessionStorage.setItem('auth_token', response.token);
        if (response?.usuario) sessionStorage.setItem('auth_usuario', JSON.stringify(response.usuario));
=======
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
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      })
    );
  }

  recuperarPassword(email: string): Observable<any> {
<<<<<<< HEAD
=======
    console.log('🔐 [AUTH SERVICE] Enviando solicitud de recuperación de contraseña');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    return this.http.post(`${this.API_URL}/recuperar-password`, { email });
  }

  resetearPassword(token: string, nueva_password: string): Observable<any> {
<<<<<<< HEAD
=======
    console.log('🔐 [AUTH SERVICE] Reseteando contraseña con token');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    return this.http.post(`${this.API_URL}/resetear-password`, { token, nueva_password });
  }

  cambiarPasswordPrimeraVez(nueva_password: string): Observable<any> {
<<<<<<< HEAD
=======
    console.log('🔐 [AUTH SERVICE] Cambiando contraseña primera vez');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    return this.http.post(`${this.API_URL}/cambiar-password-primera-vez`, { nueva_password });
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  getUsuario(): any {
    const usuarioJson = sessionStorage.getItem('auth_usuario');
<<<<<<< HEAD
    return usuarioJson ? JSON.parse(usuarioJson) : null;
=======
    if (usuarioJson) {
      return JSON.parse(usuarioJson);
    }
    return null;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  isPrimeraVez(): boolean {
    const usuario = this.getUsuario();
<<<<<<< HEAD
=======
    console.log('🔐 [AUTH] isPrimeraVez:', usuario?.primeraVez);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    return usuario?.primeraVez === true;
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
<<<<<<< HEAD
=======
    console.log('🚪 [AUTH] Cerrando sesión');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_usuario');
  }
}