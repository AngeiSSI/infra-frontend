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
<<<<<<< HEAD
  private readonly API_URL = 'https://api-infra-actividades-g0dve6hncubtf8au.westcentralus-01.azurewebsites.net/';
=======
  private readonly API_URL = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net';
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

  constructor(private http: HttpClient) {}

  // ================= CATÁLOGO =================
  getCatalogo(): Observable<Catalogo[]> {
<<<<<<< HEAD
    return this.http.get<Catalogo[]>(`${this.API_URL}catalogo`);
=======
    return this.http.get<Catalogo[]>(`${this.API_URL}/catalogo`);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  // ================= ACTIVIDADES =================
  getActividades(): Observable<Actividad[]> {
<<<<<<< HEAD
    return this.http.get<Actividad[]>(`${this.API_URL}actividades`).pipe(
=======
    return this.http.get<Actividad[]>(`${this.API_URL}/actividades`).pipe(
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
    return this.http.post<Actividad>(`${this.API_URL}actividades`, actividad);
=======
    return this.http.post<Actividad>(`${this.API_URL}/actividades`, actividad);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  // ================= OBSERVACIONES =================
  agregarObservacion(actividadId: string, comentario: string, horas: number = 0): Observable<Actividad> {
    return this.http.post<Actividad>(
<<<<<<< HEAD
      `${this.API_URL}actividades/${actividadId}/observaciones`,
=======
      `${this.API_URL}/actividades/${actividadId}/observaciones`,
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      { comentario, horas }
    );
  }

  // ================= CERRAR ACTIVIDAD =================
  cerrarActividad(actividadId: string): Observable<Actividad> {
    return this.http.post<Actividad>(
<<<<<<< HEAD
      `${this.API_URL}actividades/${actividadId}/cerrar`,
=======
      `${this.API_URL}/actividades/${actividadId}/cerrar`,
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      {}
    );
  }

<<<<<<< HEAD
  // ================= ACTUALIZAR ACTIVIDAD =================
  actualizarActividad(actividadId: string, datos: any): Observable<Actividad> {
    console.log('📤 Service: Enviando PUT a:', `${this.API_URL}actividades/${actividadId}`);
    console.log('📤 Service: Datos:', datos);
    return this.http.put<Actividad>(`${this.API_URL}actividades/${actividadId}`, datos);
  }

  // ================= JUSTIFICACIÓN DE VENCIMIENTOS =================
  enviarAValidacion(actividadId: string, justificacion: JustificacionCierre): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}actividades/${actividadId}/validar-cierre`,
=======
  // ================= JUSTIFICACIÓN DE VENCIMIENTOS =================
  enviarAValidacion(actividadId: string, justificacion: JustificacionCierre): Observable<Actividad> {
    return this.http.post<Actividad>(
      `${this.API_URL}/actividades/${actividadId}/validar-cierre`,
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      justificacion
    );
  }

  aprobarCierre(actividadId: string, comentario: string = ''): Observable<Actividad> {
    return this.http.post<Actividad>(
<<<<<<< HEAD
      `${this.API_URL}actividades/${actividadId}/aprobar-cierre`,
=======
      `${this.API_URL}/actividades/${actividadId}/aprobar-cierre`,
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      { comentario }
    );
  }

  rechazarCierre(actividadId: string, comentario: string): Observable<Actividad> {
    return this.http.post<Actividad>(
<<<<<<< HEAD
      `${this.API_URL}actividades/${actividadId}/rechazar-cierre`,
=======
      `${this.API_URL}/actividades/${actividadId}/rechazar-cierre`,
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      { comentario }
    );
  }

  // ================= HISTORIAL DE VENCIMIENTOS =================
  getHistorialVencimientos(filtros?: { lider?: string; proyecto?: string; estado?: string }): Observable<any[]> {
<<<<<<< HEAD
    let url = `${this.API_URL}historial-vencimientos`;
=======
    let url = `${this.API_URL}/historial-vencimientos`;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    
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
<<<<<<< HEAD
      `${this.API_URL}historial-vencimientos/${actividadId}`
=======
      `${this.API_URL}/historial-vencimientos/${actividadId}`
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    );
  }

  getEstadisticasHistorial(): Observable<any> {
    return this.http.get<any>(
<<<<<<< HEAD
      `${this.API_URL}historial-vencimientos-stats`
=======
      `${this.API_URL}/historial-vencimientos-stats`
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    );
  }

  // ================= PROYECTOS =================
  getProyectos(): Observable<string[]> {
<<<<<<< HEAD
    return this.http.get<any[]>(`${this.API_URL}asignaciones`).pipe(
=======
    return this.http.get<any[]>(`${this.API_URL}/asignaciones`).pipe(
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      map((asignaciones) => {
        const proyectosConAsignacion = asignaciones
          .filter((a) => a.porcentajeAsignacion > 0)
          .map((a) => a.proyecto);
        
        return [...new Set(proyectosConAsignacion)].sort();
      })
    );
  }

  getAsignaciones(): Observable<any[]> {
<<<<<<< HEAD
    return this.http.get<any[]>(`${this.API_URL}asignaciones`);
=======
    return this.http.get<any[]>(`${this.API_URL}/asignaciones`);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  // ================= CONTRASEÑA =================
  recuperarPassword(email: string): Observable<any> {
<<<<<<< HEAD
    return this.http.post(`${this.API_URL}recuperar-password`, { email });
  }

  resetearPasswordConToken(token: string, nueva_password: string): Observable<any> {
    return this.http.post(`${this.API_URL}resetear-password`, { token, nueva_password });
=======
    return this.http.post(`${this.API_URL}/recuperar-password`, { email });
  }

  resetearPasswordConToken(token: string, nueva_password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/resetear-password`, { token, nueva_password });
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  resetearPasswordUsuario(usuarioId: string, nueva_password: string): Observable<any> {
    return this.http.put(
<<<<<<< HEAD
      `${this.API_URL}usuarios/${usuarioId}/resetear-password`,
=======
      `${this.API_URL}/usuarios/${usuarioId}/resetear-password`,
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      { nueva_password }
    );
  }

  // ================= USUARIOS =================
  getUsuarios(): Observable<Usuario[]> {
<<<<<<< HEAD
    return this.http.get<Usuario[]>(`${this.API_URL}usuarios`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.API_URL}usuarios`, usuario);
  }

  actualizarUsuario(usuarioId: string, usuario: any): Observable<any> {
    return this.http.put(`${this.API_URL}usuarios/${usuarioId}`, usuario);
  }

  eliminarUsuario(usuarioId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}usuarios/${usuarioId}`);
=======
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
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  // ================= MISCELÁNEO =================
  obtenerActividades(): Observable<any[]> {
<<<<<<< HEAD
    return this.http.get<any[]>(`${this.API_URL}actividades`);
=======
    return this.http.get<any[]>(`${this.API_URL}/actividades`);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }
}