import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Usuario, CredencialLogin, TokenResponse } from '../../models/usuario.model';
import { StorageService } from '../shared/storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public usuario$ = this.usuarioSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.inicializarSesion();
  }

  private inicializarSesion(): void {
    const token = this.storageService.obtener('token');
    const usuario = this.storageService.obtener('usuario');

    if (token) {
      this.tokenSubject.next(token);
    }

    if (usuario) {
      this.usuarioSubject.next(JSON.parse(usuario));
    }
  }

  login(credenciales: CredencialLogin): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credenciales)
      .pipe(
        tap(response => {
          this.storageService.guardar('token', response.token);
          this.storageService.guardar('usuario', JSON.stringify(response.usuario));
          this.tokenSubject.next(response.token);
          this.usuarioSubject.next(response.usuario);
        })
      );
  }

  logout(): void {
    this.storageService.eliminar('token');
    this.storageService.eliminar('usuario');
    this.tokenSubject.next(null);
    this.usuarioSubject.next(null);
  }

  registro(usuario: Usuario): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/registro`, usuario)
      .pipe(
        tap(response => {
          this.storageService.guardar('token', response.token);
          this.storageService.guardar('usuario', JSON.stringify(response.usuario));
          this.tokenSubject.next(response.token);
          this.usuarioSubject.next(response.usuario);
        })
      );
  }

  renovarToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/renovar-token`, {})
      .pipe(
        tap(response => {
          this.storageService.guardar('token', response.token);
          this.tokenSubject.next(response.token);
        })
      );
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  obtenerToken(): string | null {
    return this.tokenSubject.value;
  }

  estaAutenticado(): boolean {
    return !!this.tokenSubject.value;
  }

  tieneRol(rol: string): boolean {
    const usuario = this.usuarioSubject.value;
    return usuario ? usuario.rol === rol : false;
  }

  tienePermiso(codigo: string): boolean {
    const usuario = this.usuarioSubject.value;
    return usuario && usuario.permiso ? usuario.permiso.includes(codigo) : false;
  }

  cambiarContrasena(passwordActual: string, passwordNueva: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cambiar-contrasena`, {
      passwordActual,
      passwordNueva
    });
  }

  resetearContrasena(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resetear-contrasena`, { email });
  }

  confirmarReseteo(token: string, passwordNueva: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirmar-reseteo`, {
      token,
      passwordNueva
    });
  }
}