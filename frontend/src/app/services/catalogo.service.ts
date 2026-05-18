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
  observaciones?: string;
  fechaAprobacion?: Date;
  aprobadoPor?: string;
}

export interface ImportacionCatalogoItem {
  tipificacion: string;
  actividad: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrl = 'https://api-infra-actividades-g0dve6hncubtf8au.westcentralus-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

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

  importarCatalogo(items: ImportacionCatalogoItem[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/catalogo/importar`, { items });
  }

  getHistorico(filtros?: { estado?: string; sugeridoPor?: string }): Observable<HistoricoItem[]> {
    let url = `${this.apiUrl}/catalogo/historico`;

    if (filtros) {
      const params = new URLSearchParams();

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