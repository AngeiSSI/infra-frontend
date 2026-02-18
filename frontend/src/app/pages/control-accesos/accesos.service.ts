import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  password?: string;
  rol: string;
  grupo?: string;
  activo?: boolean;
  fechaCreacion?: Date;
}

export interface Acceso {
  _id?: string;
  usuarioId: string;
  modulo: string;
  permiso: 'ver' | 'crear' | 'editar' | 'eliminar' | 'cerrar';
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccesosService {
  private readonly API_URL = 'https://api-infra-actividades-prod-aqcuagc5bje7ddfu.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`);
  }

  crearUsuario(usuario: { nombre: string; email: string; password: string; rol: string; grupo?: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/usuarios`, usuario);
  }

  actualizarUsuario(usuarioId: string, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${usuarioId}`, usuario);
  }

  eliminarUsuario(usuarioId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/usuarios/${usuarioId}`);
  }

  getAccesos(usuarioId?: string): Observable<Acceso[]> {
    const url = usuarioId 
      ? `${this.API_URL}/accesos?usuarioId=${usuarioId}`
      : `${this.API_URL}/accesos`;
    return this.http.get<Acceso[]>(url);
  }

  actualizarAccesos(usuarioId: string, accesos: Acceso[]): Observable<Acceso[]> {
    return this.http.post<Acceso[]>(
      `${this.API_URL}/usuarios/${usuarioId}/accesos`,
      { accesos }
    );
  }
}