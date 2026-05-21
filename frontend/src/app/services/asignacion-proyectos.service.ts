import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ProyectoActividadPlanificada {
  idLocal: string;
  catalogoId: string;
  tipificacion: string;
  actividad: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  responsable: string;
  fechaInicio: string;
  fechaFin: string;
  dependenciaIdLocal?: string;
  observaciones?: string;
}

export interface ProyectoAsignacionPayload {
  nombreProyecto: string;
  liderInfraestructura: string;
  liderInfraestructuraFV: string;
  gerenteSolicitante: string;
  liderTecnico: string;
  scrum: string;
  po: string;
  flujoValor: string;
  celula: string;
  arquitecto: string;
  fechaSolicitud: string;
  contexto: string;
  idFeature: string;
  pep: string;
  tipoProyecto: string;
  faseProyecto: string;
  porcentajeAsignacion: number;
  actividades: ProyectoActividadPlanificada[];
}

export interface ProyectoAsignacionGuardado {
  id: string;
  nombreProyecto: string;
  liderInfraestructura: string;
  liderInfraestructuraFV: string;
  gerenteSolicitante: string;
  liderTecnico: string;
  scrum: string;
  po: string;
  flujoValor: string;
  celula: string;
  arquitecto: string;
  fechaSolicitud: string;
  contexto: string;
  idFeature: string;
  pep: string;
  tipoProyecto: string;
  faseProyecto: string;
  porcentajeAsignacion: number;
  actividades: ProyectoActividadPlanificada[];
  estado: 'borrador' | 'finalizado';
  fechaCreacion: string;
  fechaModificacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionProyectosService {
  private readonly storageKey = 'asignacion_proyectos_items';

  constructor() {}

  private leer(): ProyectoAsignacionGuardado[] {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as ProyectoAsignacionGuardado[];
    } catch (error) {
      console.error('Error al leer asignaciones de proyectos:', error);
      return [];
    }
  }

  private guardar(items: ProyectoAsignacionGuardado[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  obtenerBorradores(): Observable<ProyectoAsignacionGuardado[]> {
    const items = this.leer()
      .filter(item => item.estado === 'borrador')
      .sort((a, b) => b.fechaModificacion.localeCompare(a.fechaModificacion));

    return of(items);
  }

  obtenerHistorico(): Observable<ProyectoAsignacionGuardado[]> {
    const items = this.leer()
      .filter(item => item.estado === 'finalizado')
      .sort((a, b) => b.fechaModificacion.localeCompare(a.fechaModificacion));

    return of(items);
  }

  guardarBorrador(payload: ProyectoAsignacionPayload, id?: string): Observable<ProyectoAsignacionGuardado> {
    const items = this.leer();
    const ahora = new Date().toISOString();

    if (id) {
      const index = items.findIndex(item => item.id === id);

      if (index >= 0) {
        items[index] = {
          ...items[index],
          ...payload,
          estado: 'borrador',
          fechaModificacion: ahora
        };

        this.guardar(items);
        return of(items[index]);
      }
    }

    const nuevo: ProyectoAsignacionGuardado = {
      id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `proy_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...payload,
      estado: 'borrador',
      fechaCreacion: ahora,
      fechaModificacion: ahora
    };

    items.unshift(nuevo);
    this.guardar(items);
    return of(nuevo);
  }

  guardarFinalizado(payload: ProyectoAsignacionPayload, id?: string): Observable<ProyectoAsignacionGuardado> {
    const items = this.leer();
    const ahora = new Date().toISOString();

    if (id) {
      const index = items.findIndex(item => item.id === id);

      if (index >= 0) {
        items[index] = {
          ...items[index],
          ...payload,
          estado: 'finalizado',
          fechaModificacion: ahora
        };

        this.guardar(items);
        return of(items[index]);
      }
    }

    const nuevo: ProyectoAsignacionGuardado = {
      id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `proy_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...payload,
      estado: 'finalizado',
      fechaCreacion: ahora,
      fechaModificacion: ahora
    };

    items.unshift(nuevo);
    this.guardar(items);
    return of(nuevo);
  }

  eliminarBorrador(id: string): Observable<boolean> {
    const items = this.leer();
    const filtrados = items.filter(item => !(item.id === id && item.estado === 'borrador'));
    const eliminado = filtrados.length < items.length;

    if (eliminado) {
      this.guardar(filtrados);
    }

    return of(eliminado);
  }
}