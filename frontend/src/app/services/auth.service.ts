import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://api-infra-actividades-prod-aqcuagc5bje7ddfu.westcentralus-01.azurewebsites.net';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USUARIO_KEY = 'auth_usuario';

  constructor(private http: HttpClient) {
    this.initToken();
  }

  private initToken(): void {
    console.log('🔐 [AUTH INIT] Token en sessionStorage:', !!sessionStorage.getItem(this.TOKEN_KEY));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('✅ [AUTH] Login response recibido:', response);
        this.setToken(response.token, response.usuario);
      })
    );
  }

  setToken(token: string, usuario: any): void {
    console.log('💾 [AUTH] Guardando token y usuario en sessionStorage');
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USUARIO_KEY, JSON.stringify(usuario));
    console.log('💾 [AUTH] Usuario guardado:', usuario);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): any {
    const usuario = sessionStorage.getItem(this.USUARIO_KEY);
    return usuario ? JSON.parse(usuario) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ✅ NUEVO MÉTODO
  isPrimeraVez(): boolean {
    const usuario = this.getUsuario();
    console.log('🔐 [AUTH] isPrimeraVez:', usuario?.primeraVez);
    return usuario?.primeraVez === true;
  }

  // ✅ NUEVO MÉTODO
  cambiarPasswordPrimeraVez(nueva_password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/cambiar-password-primera-vez`, { nueva_password }).pipe(
      tap((response: any) => {
        console.log('✅ [AUTH] Contraseña cambiada, actualizando usuario');
        const usuarioActualizado = { ...this.getUsuario(), primeraVez: false };
        this.setToken(this.getToken()!, usuarioActualizado);
      })
    );
  }

  logout(): void {
    console.log('🚪 [AUTH] Logout');
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USUARIO_KEY);
  }
}