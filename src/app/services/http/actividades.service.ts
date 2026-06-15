import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad, Gestion, HistorialActividad, DocumentoAdjunto } from '../../models/actividad.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  private apiUrl = `${environment.apiUrl}/actividades`;

  constructor(private http: HttpClient) { }

  // CRUD Actividades
  obtenerTodas(filtros?: any): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  obtenerPorId(id: string): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.apiUrl}/${id}`);
  }

  crear(actividad: Actividad): Observable<any> {
    return this.http.post<any>(this.apiUrl, actividad);
  }

  actualizar(id: string, actividad: Partial<Actividad>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, actividad);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Gestiones
  obtenerGestiones(actividadId: string): Observable<Gestion[]> {
    return this.http.get<Gestion[]>(`${this.apiUrl}/${actividadId}/gestiones`);
  }

  agregarGestion(actividadId: string, gestion: Gestion): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${actividadId}/gestiones`, gestion);
  }

  actualizarGestion(actividadId: string, gestionId: string, gestion: Gestion): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${actividadId}/gestiones/${gestionId}`, gestion);
  }

  eliminarGestion(actividadId: string, gestionId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${actividadId}/gestiones/${gestionId}`);
  }

  // Historial
  obtenerHistorial(actividadId: string): Observable<HistorialActividad[]> {
    return this.http.get<HistorialActividad[]>(`${this.apiUrl}/${actividadId}/historial`);
  }

  // Documentos
  obtenerDocumentos(actividadId: string): Observable<DocumentoAdjunto[]> {
    return this.http.get<DocumentoAdjunto[]>(`${this.apiUrl}/${actividadId}/documentos`);
  }

  subirDocumento(actividadId: string, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<any>(`${this.apiUrl}/${actividadId}/documentos`, formData);
  }

  descargarDocumento(actividadId: string, documentoId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${actividadId}/documentos/${documentoId}/descargar`, {
      responseType: 'blob'
    });
  }

  // Acciones especiales
  cerrarActividad(actividadId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${actividadId}/cerrar`, {});
  }

  solicitarVencimiento(actividadId: string, motivo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${actividadId}/solicitar-vencimiento`, { motivo });
  }

  obtenerAgrupadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/agrupadas`);
  }

  obtenerActividadesRelacionadas(actividadId: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/${actividadId}/relacionadas`);
  }

  obtenerAuditoria(actividadId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${actividadId}/auditoria`);
  }
}