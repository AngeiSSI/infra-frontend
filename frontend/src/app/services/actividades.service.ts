import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Observacion {
  fecha: Date;
  comentario: string;
  usuario?: string;
  horas?: number;
}

export interface JustificacionCierre {
  texto: string;
  usuario: string;
  fecha: Date;
  asunto?: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado';
  comentarioCoordinador?: string;
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
  horasMes?: number;
  horasAcumuladas?: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaCierre?: Date;
  observaciones?: Observacion[];
  justificacionCierre?: JustificacionCierre;
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

  // ================= CATÁLOGO =================
  getCatalogo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.API_URL}/catalogo`);
  }

  // ================= ACTIVIDADES =================
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API_URL}/actividades`).pipe(
      map((actividades) => {
        this.getUsuarios().subscribe((usuarios) => {
          actividades.forEach((actividad) => {
            const usuarioLider = usuarios.find(
              (u: Usuario) => u.nombre === actividad.lider
            );
            
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

  // ================= OBSERVACIONES =================
  agregarObservacion(actividadId: string, comentario: string, horas: number = 0): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/observaciones`,
      { comentario, horas }
    );
  }

  // ================= CERRAR ACTIVIDAD =================
  cerrarActividad(actividadId: string): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/cerrar`,
      {}
    );
  }

  // ================= JUSTIFICACIÓN DE VENCIMIENTOS =================
  enviarAValidacion(actividadId: string, justificacion: JustificacionCierre): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/validar-cierre`,
      justificacion
    );
  }

  aprobarCierre(actividadId: string, comentario: string = ''): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/aprobar-cierre`,
      { comentario }
    );
  }

  rechazarCierre(actividadId: string, comentario: string): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/rechazar-cierre`,
      { comentario }
    );
  }

  // ================= HISTORIAL DE VENCIMIENTOS =================
  getHistorialVencimientos(filtros?: { lider?: string; proyecto?: string; estado?: string }): Observable<any[]> {
    let url = `${this.API_URL}/historial-vencimientos`;
    
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.lider) params.append('lider', filtros.lider);
      if (filtros.proyecto) params.append('proyecto', filtros.proyecto);
      if (filtros.estado) params.append('estado', filtros.estado);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    
    return this.http.get<any[]>(url);
  }

  getHistorialPorActividad(actividadId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API_URL}/historial-vencimientos/${actividadId}`
    );
  }

  getEstadisticasHistorial(): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/historial-vencimientos-stats`
    );
  }

  // ================= PROYECTOS =================
  getProyectos(): Observable<string[]> {
    return this.http.get<any[]>(`${this.API_URL}/asignaciones`).pipe(
      map((asignaciones) => {
        const proyectosConAsignacion = asignaciones
          .filter((a) => a.porcentajeAsignacion > 0)
          .map((a) => a.proyecto);
        
        return [...new Set(proyectosConAsignacion)].sort();
      })
    );
  }

  getAsignaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/asignaciones`);
  }

  // ================= CONTRASEÑA =================
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

  // ================= USUARIOS =================
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

  // ================= MISCELÁNEO =================
  obtenerActividades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/actividades`);
  }
}