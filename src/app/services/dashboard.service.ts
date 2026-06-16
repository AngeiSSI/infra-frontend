import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getDashboardEjecutivo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dashboard/ejecutivo`);
  }

  getDashboardTTM(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dashboard/ttm`);
  }

  getKPIs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/kpis`);
  }
}