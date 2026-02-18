import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Observacion {
  fecha: Date;
  comentario: string;
  usuario?: string;
}

export interface Actividad {
  _id?: string;
  lider: string;
  proyecto: string;
  tipificacion: string;
  actividadCatalogo: string;
  descripcion: string;
  estado: string;
  estadoCaso?: string;
  horas: number;
  horasAcumuladas?: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaCierre?: Date;
  observaciones?: Observacion[];
}

export interface Catalogo {
  _id?: string;
  tipificacion: string;
  actividad: string;
  diasHabiles: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private readonly API_URL = 'https://api-infra-actividades-prod-aqcuagc5bje7ddfu.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  // CATÁLOGO
  getCatalogo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.API_URL}/catalogo`);
  }

  // ACTIVIDADES
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API_URL}/actividades`);
  }

  crearActividad(actividad: any): Observable<Actividad> {
    return this.http.post<Actividad>(`${this.API_URL}/actividades`, actividad);
  }

  agregarObservacion(actividadId: string, comentario: string): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/observaciones`,
      { comentario }
    );
  }

  cerrarActividad(actividadId: string): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/cerrar`,
      {}
    );
  }

  // PASSWORD RECOVERY
  recuperarPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/recuperar-password`, { email });
  }

  resetearPasswordConToken(token: string, nueva_password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/resetear-password`, { token, nueva_password });
  }

  resetearPasswordUsuario(usuarioId: string, nueva_password: string): Observable<any> {
    return this.http.put(
      `${this.API_URL}/usuarios/${usuarioId}/resetear-password`,
      { nueva_password }
    );
  }

  // USUARIOS
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/usuarios`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios`, usuario);
  }

  actualizarUsuario(usuarioId: string, usuario: any): Observable<any> {
    return this.http.put(`${this.API_URL}/usuarios/${usuarioId}`, usuario);
  }

  eliminarUsuario(usuarioId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/usuarios/${usuarioId}`);
  }
}