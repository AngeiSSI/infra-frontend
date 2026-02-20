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

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrl = 'https://api-infra-actividades-prod-hygpfxfdeudpfsaz.westcentralus-01.azurewebsites.net/';

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
}