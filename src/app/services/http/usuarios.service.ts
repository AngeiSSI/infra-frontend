import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, Permiso } from '../../models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = `${environment.apiUrl}/usuarios`;
  private permisosUrl = `${environment.apiUrl}/permisos`;

  constructor(private http: HttpClient) { }

  // CRUD Usuarios
  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  actualizar(id: string, usuario: Partial<Usuario>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Permisos
  obtenerPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.permisosUrl);
  }

  obtenerPermisosUsuario(usuarioId: string): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}/${usuarioId}/permisos`);
  }

  asignarPermisos(usuarioId: string, permisos: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${usuarioId}/permisos`, { permisos });
  }

  // Búsqueda
  buscar(termino: string, rol?: string): Observable<Usuario[]> {
    let params = new HttpParams().set('q', termino);
    if (rol) {
      params = params.set('rol', rol);
    }
    return this.http.get<Usuario[]>(`${this.apiUrl}/buscar`, { params });
  }

  obtenerLideres(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?rol=Líder`);
  }

  obtenerSenior(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?rol=Senior`);
  }

  obtenerCoordinadores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?rol=Coordinador`);
  }
}