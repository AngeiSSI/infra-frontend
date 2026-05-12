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

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private readonly API_URL = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  // Obtener todas las asignaciones
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.API_URL}/asignaciones`);
  }

  // Crear nueva asignación
  crearAsignacion(asignacion: any): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.API_URL}/asignaciones`, asignacion);
  }

  // Actualizar asignación
  actualizarAsignacion(id: string, asignacion: any): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.API_URL}/asignaciones/${id}`, asignacion);
  }

  // Eliminar asignación
  eliminarAsignacion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/asignaciones/${id}`);
  }
}