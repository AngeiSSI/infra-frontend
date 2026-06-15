import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asignacion, CapacidadLider } from '../../models/asignacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {

  private apiUrl = `${environment.apiUrl}/asignaciones`;
  private capacidadUrl = `${environment.apiUrl}/asignaciones/capacidad`;
  private aprobacionesUrl = `${environment.apiUrl}/aprobaciones-cierre`;
  private asignacionProyectosUrl = `${environment.apiUrl}/asignaciones-proyectos`;

  constructor(private http: HttpClient) { }

  // CRUD Asignaciones
  obtenerTodas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.apiUrl}/${id}`);
  }

  crear(asignacion: Asignacion): Observable<any> {
    return this.http.post<any>(this.apiUrl, asignacion);
  }

  actualizar(id: string, asignacion: Partial<Asignacion>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asignacion);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Capacidad
  obtenerCapacidad(filtros?: any): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<any>(this.capacidadUrl, { params });
  }

  obtenerCapacidadLider(liderId: string): Observable<CapacidadLider> {
    return this.http.get<CapacidadLider>(`${this.capacidadUrl}/${liderId}`);
  }

  obtenerProyectosLider(liderId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.capacidadUrl}/${liderId}/proyectos`);
  }

  actualizarCapacidad(liderId: string, datos: any): Observable<any> {
    return this.http.put<any>(`${this.capacidadUrl}/${liderId}`, datos);
  }

  // Aprobaciones de Cierre
  obtenerAprobacionesCierre(filtros?: any): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<any>(this.aprobacionesUrl, { params });
  }

  aprobarCierre(solicitudId: string): Observable<any> {
    return this.http.post<any>(`${this.aprobacionesUrl}/${solicitudId}/aprobar`, {});
  }

  rechazarCierre(solicitudId: string, motivo: string): Observable<any> {
    return this.http.post<any>(`${this.aprobacionesUrl}/${solicitudId}/rechazar`, { motivo });
  }

  // Asignación de Proyectos
  crearAsignacionProyecto(datos: any): Observable<any> {
    return this.http.post<any>(this.asignacionProyectosUrl, datos);
  }

  obtenerAsignacionesProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.asignacionProyectosUrl);
  }

  generarPDFAsignacion(datos: any): Observable<Blob> {
    return this.http.post(`${this.asignacionProyectosUrl}/generar-pdf`, datos, {
      responseType: 'blob'
    });
  }
}