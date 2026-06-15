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
  nombre?: string; // ✅ Asegurar que está aquí
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
  proyecto: string;
  lider?: string;
  fechaCreacion: Date;
  fechaCierre?: Date;
  estado: string;
  microTareas: Actividad[];
  estaActiva: boolean;
  esGrupoCierre?: boolean;
}

export interface GrupoProyecto {
  proyecto: string;
  gruposMacroTareas: GrupoMacroTarea[];
}

export interface GrupoLider {
  lider: string;
  proyectos: Map<string, GrupoMacroTarea[]>;
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
  // ✅ Normalizar los datos según lo que espera el backend
  const actividadProcesada = {
    nombre: actividad.actividadCatalogo || actividad.descripcion, // ✅ Agregar nombre
    lider: actividad.lider, // ✅ El backend SÍ requiere esto
    grupoLider: actividad.grupoLider,
    proyecto: actividad.proyecto,
    tipificacion: actividad.tipificacion,
    actividadCatalogo: actividad.actividadCatalogo,
    descripcion: actividad.descripcion,
    horas: Number(actividad.horas),
    estado: 'en progreso',
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString()
  };

  console.log('📤 Enviando actividad normalizada:', JSON.stringify(actividadProcesada, null, 2));

  return this.http.post<Actividad>(
    `${this.API_URL}/actividades`,
    actividadProcesada
  ).pipe(
    map(response => {
      console.log('✅ Respuesta del servidor:', response);
      return response;
    })
  );
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

  // ================= AGRUPAR POR MACRO TAREA - GENÉRICO =================
private agruparPorMacroTareaGenerico(actividades: Actividad[]): GrupoMacroTarea[] {
  const gruposMap = new Map<string, GrupoMacroTarea>();
  const actividadesNormales: Actividad[] = [];

  actividades.forEach((act) => {
    if (act.macroTareaId && act.indiceSecuencia !== undefined) {
      // Es una micro tarea con macro tarea
      const key = act.macroTareaId || 'sin-grupo';
      if (!gruposMap.has(key)) {
        gruposMap.set(key, {
          macroTareaId: act.macroTareaId,
          macroTareaNombre: act.macroTareaNombre || 'Sin nombre',
          proyecto: act.proyecto,
          lider: act.lider,
          fechaCreacion: act.fechaCreacion,
          fechaCierre: undefined,
          estado: 'en progreso',
          microTareas: [],
          estaActiva: true,
          esGrupoCierre: act.macroTareaId === 'cierre-proyecto'
        });
      }
      gruposMap.get(key)!.microTareas.push(act);
    } else {
      // Es una actividad normal
      actividadesNormales.push(act);
    }
  });

  // Procesar grupos de macro tareas
  gruposMap.forEach((grupo) => {
    grupo.microTareas.sort((a, b) => 
      (a.indiceSecuencia || 0) - (b.indiceSecuencia || 0)
    );

    const todasCerradas = grupo.microTareas.every(m => m.estado === 'cerrado' || m.estado === 'cerrada_vencida');

    if (todasCerradas) {
      grupo.estado = 'cerrado';
      grupo.estaActiva = false;
      grupo.fechaCierre = grupo.microTareas[grupo.microTareas.length - 1].fechaCierre;
    }
  });

  let resultado: GrupoMacroTarea[] = Array.from(gruposMap.values());

  // ✅ Agrupar actividades normales por "Tareas Directas"
  const actividadesPorProyecto = new Map<string, Actividad[]>();
  
  actividadesNormales.forEach((act) => {
    const proyecto = act.proyecto;
    if (!actividadesPorProyecto.has(proyecto)) {
      actividadesPorProyecto.set(proyecto, []);
    }
    actividadesPorProyecto.get(proyecto)!.push(act);
  });

  // Crear un grupo "Tareas Directas" por proyecto si hay actividades normales
  actividadesPorProyecto.forEach((tareas, proyecto) => {
    resultado.push({
      macroTareaNombre: '📋 Tareas Directas',
      proyecto: proyecto,
      lider: tareas[0].lider, // Usar el líder de la primera tarea
      fechaCreacion: new Date(),
      fechaCierre: undefined,
      estado: 'en progreso',
      microTareas: tareas,
      estaActiva: tareas.some(t => t.estado !== 'cerrado' && t.estado !== 'cerrada_vencida'),
      esGrupoCierre: false
    });
  });

  return resultado;
}

  // ================= AGRUPAR POR PROYECTO (Mis Actividades) =================
agruparPorProyecto(actividades: Actividad[]): GrupoMacroTarea[] {
  const grupos = this.agruparPorMacroTareaGenerico(actividades);

  // Ordenar por proyecto y luego por fecha
  grupos.sort((a, b) => {
    if (a.proyecto !== b.proyecto) {
      return a.proyecto.localeCompare(b.proyecto);
    }
    // Las "Tareas Directas" van al final del proyecto
    const aEsDirecta = a.macroTareaNombre === '📋 Tareas Directas' ? 1 : 0;
    const bEsDirecta = b.macroTareaNombre === '📋 Tareas Directas' ? 1 : 0;
    if (aEsDirecta !== bEsDirecta) {
      return aEsDirecta - bEsDirecta;
    }
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });

  return grupos;
}

  // ================= AGRUPAR POR LIDER Y PROYECTO (Grupo, Total, Seguimiento) =================
agruparPorLiderYProyecto(actividades: Actividad[]): GrupoMacroTarea[] {
  const grupos = this.agruparPorMacroTareaGenerico(actividades);

  // Ordenar por lider, proyecto y fecha
  grupos.sort((a, b) => {
    // Primero por líder
    if (a.lider !== b.lider) {
      return (a.lider || '').localeCompare(b.lider || '');
    }
    // Luego por proyecto
    if (a.proyecto !== b.proyecto) {
      return a.proyecto.localeCompare(b.proyecto);
    }
    // Las "Tareas Directas" van al final
    const aEsDirecta = a.macroTareaNombre === '📋 Tareas Directas' ? 1 : 0;
    const bEsDirecta = b.macroTareaNombre === '📋 Tareas Directas' ? 1 : 0;
    if (aEsDirecta !== bEsDirecta) {
      return aEsDirecta - bEsDirecta;
    }
    // Finalmente por fecha de creación
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });

  return grupos;
}

  // ================= MÉTODO LEGACY - AGRUPAR POR MACRO TAREA =================
  agruparPorMacroTarea(actividades: Actividad[]): GrupoMacroTarea[] {
    return this.agruparPorProyecto(actividades);
  }
}