import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAuditoria(filtros?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/auditoria`, { params: filtros });
  }

  getEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auditoria/stats`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/auditoria/exportar/excel`, { responseType: 'blob' });
  }
}