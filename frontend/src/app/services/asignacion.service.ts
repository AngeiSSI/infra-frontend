import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asignacion {
  _id?: string;
  liderAsignado: string;
  proyecto: string;
  idFeature: string;
  tipologia: string;
  porcentajeAsignacion: number;
  liSenior?: string;
  liderTecnico?: string;
  scrum?: string;
  po?: string;
  liderTecnicoFV?: string;
  gerente?: string;
  flujoValor?: string;
  celula?: string;
  pep?: string;
  fechaAsignacion: Date;
  fechaFinAsignacion?: Date;
  estado?: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

export interface Actividad {
  _id?: string;
  nombre: string;
  macroTareaId?: string;
  macroTareaNombre?: string;
  lider: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: string;
  diasHabiles?: number;
  horasMinimas?: number;
  horasMaximas?: number;
  esUltima?: boolean;
  indiceSecuencia?: number;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private readonly API_URL = 'https://api-infra-actividades-gwevagd8g0dfaxcv.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  // ✅ OBTENER TODAS LAS ASIGNACIONES
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.API_URL}/asignaciones`);
  }

  // ✅ CREAR NUEVA ASIGNACIÓN
  crearAsignacion(asignacion: any): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.API_URL}/asignaciones`, asignacion);
  }

  // ✅ ACTUALIZAR ASIGNACIÓN
  actualizarAsignacion(id: string, asignacion: any): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.API_URL}/asignaciones/${id}`, asignacion);
  }

  // ✅ ELIMINAR ASIGNACIÓN
  eliminarAsignacion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/asignaciones/${id}`);
  }

  // ✅ CREAR ACTIVIDAD (NUEVA)
  crearActividad(actividad: Actividad): Observable<Actividad> {
    console.log('Creando actividad con payload:', actividad);
    return this.http.post<Actividad>(`${this.API_URL}/actividades`, actividad);
  }

  // ✅ OBTENER TODAS LAS ACTIVIDADES
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API_URL}/actividades`);
  }

  // ✅ OBTENER ACTIVIDADES DE UNA MACRO TAREA
  getActividadesPorMacroTarea(macroTareaId: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.API_URL}/actividades?macroTareaId=${macroTareaId}`);
  }

  // ✅ ACTUALIZAR ACTIVIDAD
  actualizarActividad(id: string, actividad: any): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.API_URL}/actividades/${id}`, actividad);
  }

  // ✅ ACTUALIZAR FECHA FIN Y DISPARAR SIGUIENTE ACTIVIDAD
  cerrarActividadYAvanzar(id: string, fechaCierre: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/actividades/${id}/cerrar`, { fechaCierre });
  }

  // ✅ ELIMINAR ACTIVIDAD
  eliminarActividad(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/actividades/${id}`);
  }
}