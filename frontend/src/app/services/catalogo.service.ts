import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CatalogoItem {
  _id?: string;
  tipificacion: string;
  actividad: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  estado: 'oficial' | 'pendiente';
  sugeridoPor?: string;
  rolSugeridor?: string;
  fechaSugerencia?: Date;
  fechaCreacion?: Date;
  observaciones?: string;
  activo: boolean;
}

export interface HistoricoItem {
  _id?: string;
  tipificacion: string;
  actividad: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  sugeridoPor: string;
  rolSugeridor: string;
  fechaSugerencia: Date;
  estado: 'aprobado' | 'rechazado';
<<<<<<< HEAD
  estadoHistorico?: 'aprobado' | 'rechazado';
=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  observaciones?: string;
  fechaAprobacion?: Date;
  aprobadoPor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
<<<<<<< HEAD
  private apiUrl = 'https://api-infra-actividades-g0dve6hncubtf8au.westcentralus-01.azurewebsites.net/';

  constructor(private http: HttpClient) {}

=======
  private apiUrl = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net/';

  constructor(private http: HttpClient) {}

  // ================= CATÁLOGO OFICIAL Y SUGERENCIAS =================
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  getCatalogo(esAutorizado: boolean): Observable<CatalogoItem[]> {
    const url = esAutorizado ? '/catalogo/todos' : '/catalogo';
    return this.http.get<CatalogoItem[]>(`${this.apiUrl}${url}`);
  }

  crearCatalogo(data: any): Observable<CatalogoItem> {
    return this.http.post<CatalogoItem>(`${this.apiUrl}/catalogo`, data);
  }

  actualizarCatalogo(id: string, data: any): Observable<CatalogoItem> {
    return this.http.put<CatalogoItem>(`${this.apiUrl}/catalogo/${id}`, data);
  }

  aprobarCatalogo(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/catalogo/${id}/aprobar`, {});
  }

  rechazarCatalogo(id: string, observaciones: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/catalogo/${id}/rechazar`, { observaciones });
  }

  eliminarCatalogo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/catalogo/${id}`);
  }

<<<<<<< HEAD
=======
  // ================= HISTÓRICO DE APROBACIONES Y RECHAZOS =================
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  getHistorico(filtros?: { estado?: string; sugeridoPor?: string }): Observable<HistoricoItem[]> {
    let url = `${this.apiUrl}/catalogo/historico`;
    
    if (filtros) {
      const params = new URLSearchParams();
      
<<<<<<< HEAD
=======
      // Usar "aprobado" o "rechazado" como valores
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      if (filtros.estado && filtros.estado !== 'todos') {
        params.append('estado', filtros.estado);
      }
      
      if (filtros.sugeridoPor) {
        params.append('sugeridoPor', filtros.sugeridoPor);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    
    console.log('📊 Llamando a:', url);
    return this.http.get<HistoricoItem[]>(url);
  }

  getEstadisticasHistorico(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/catalogo/historico-stats`);
  }
}