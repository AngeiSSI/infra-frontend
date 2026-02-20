import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Observacion {
  fecha: Date;
  comentario: string;
  usuario?: string;
  horas?: number;
}

export interface Actividad {
  _id?: string;
  lider: string;
  grupoLider?: string;
  proyecto: string;
  tipificacion: string;
  actividadCatalogo: string;
  descripcion: string;
  estado: string;
  estadoCaso?: string;
  horas: number;
  horasMes?: number; // Horas acumuladas del mes actual
  horasAcumuladas?: number; // Horas del mes anterior (cuando finaliza el mes)
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
  horasMinimas: number;
  horasMaximas: number;
}

export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  rol: string;
  grupo?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private readonly API_URL = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  // CATÁLOGO
  getCatalogo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.API_URL}/catalogo`);
  }

  // ACTIVIDADES - Obtener y mapear con información del grupo del líder
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API_URL}/actividades`).pipe(
      map((actividades) => {
        // Obtener usuarios para mapear grupos
        this.getUsuarios().subscribe((usuarios) => {
          actividades.forEach((actividad) => {
            // Buscar el usuario que es líder de esta actividad
            const usuarioLider = usuarios.find(
              (u: Usuario) => u.nombre === actividad.lider
            );
            // Asignar el grupo del líder a la actividad
            if (usuarioLider) {
              actividad.grupoLider = usuarioLider.grupo;
            }
          });
        });
        return actividades;
      })
    );
  }

  crearActividad(actividad: any): Observable<Actividad> {
    return this.http.post<Actividad>(`${this.API_URL}/actividades`, actividad);
  }

  agregarObservacion(actividadId: string, comentario: string, horas: number = 0): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/observaciones`,
      { comentario, horas }
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
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`);
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