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
  nombre?: string;
  lider: string;
  grupoLider?: string;
  proyecto: string;
  tipificacion: string;
  actividadCatalogo?: string;
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
  // Nuevas propiedades para micro tareas
  macroTareaId?: string;
  macroTareaNombre?: string;
  indiceSecuencia?: number;
  esUltima?: boolean;
  esUltimaMicroTarea?: boolean;
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

export interface GrupoMacroTarea {
  macroTareaId?: string;
  macroTareaNombre: string;
  fechaCreacion: Date;
  fechaCierre?: Date;
  estado: string;
  microTareas: Actividad[];
  estaActiva: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private readonly API_URL = 'https://api-infra-actividades-gwevagd8g0dfaxcv.westcentralus-01.azurewebsites.net';

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

  // ================= AGRUPAR MICRO TAREAS POR MACRO TAREA =================
  agruparPorMacroTarea(actividades: Actividad[]): GrupoMacroTarea[] {
    const grupos = new Map<string, GrupoMacroTarea>();

    // Actividades normales (no micro tareas)
    const actividadesNormales: Actividad[] = [];

    actividades.forEach((act) => {
      if (act.macroTareaId && act.indiceSecuencia !== undefined) {
        // Es una micro tarea
        const key = act.macroTareaId || 'sin-grupo';
        if (!grupos.has(key)) {
          grupos.set(key, {
            macroTareaId: act.macroTareaId,
            macroTareaNombre: act.macroTareaNombre || 'Sin nombre',
            fechaCreacion: act.fechaCreacion,
            fechaCierre: undefined,
            estado: 'en progreso',
            microTareas: [],
            estaActiva: true
          });
        }
        grupos.get(key)!.microTareas.push(act);
      } else {
        // Es una actividad normal
        actividadesNormales.push(act);
      }
    });

    // Ordenar micro tareas dentro de cada grupo por indiceSecuencia
    grupos.forEach((grupo) => {
      grupo.microTareas.sort((a, b) => 
        (a.indiceSecuencia || 0) - (b.indiceSecuencia || 0)
      );

      // Determinar estado de la macro tarea
      const todasCerradas = grupo.microTareas.every(m => m.estado === 'cerrado' || m.estado === 'cerrada_vencida');
      const algunaCerrada = grupo.microTareas.some(m => m.estado === 'cerrado' || m.estado === 'cerrada_vencida');

      if (todasCerradas) {
        grupo.estado = 'cerrado';
        grupo.estaActiva = false;
        // Fecha de cierre = fecha de cierre de la última micro tarea
        grupo.fechaCierre = grupo.microTareas[grupo.microTareas.length - 1].fechaCierre;
      } else if (algunaCerrada) {
        grupo.estado = 'en progreso';
        grupo.estaActiva = true;
      }
    });

    // Convertir a array y agregar actividades normales al final
    const resultado: GrupoMacroTarea[] = Array.from(grupos.values());

    // Agregar actividades normales como grupos sin micro tareas
    actividadesNormales.forEach((act) => {
      resultado.push({
        macroTareaNombre: act.nombre || act.actividadCatalogo || 'Actividad',
        fechaCreacion: act.fechaCreacion,
        fechaCierre: act.fechaCierre,
        estado: act.estado,
        microTareas: [act],
        estaActiva: act.estado !== 'cerrado' && act.estado !== 'cerrada_vencida'
      });
    });

    return resultado;
  }
}