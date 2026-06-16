import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('🔐 [AUTH SERVICE] Inicializado');
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioSubject.next(JSON.parse(usuario));
    }
  }

  login(email: string, password: string): Observable<any> {
    console.log('🔓 [LOGIN] Email:', email);
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('✅ [LOGIN] Éxito:', response);
        if (response.token && response.usuario) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          this.usuarioSubject.next(response.usuario);
        }
      })
    );
  }

  logout(): void {
    console.log('🚪 [LOGOUT]');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  getUsuario(): any {
    return this.usuarioSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }
}