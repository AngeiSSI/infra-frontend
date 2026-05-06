import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlujoValorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFlujos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/flujo-valor`);
  }

  getTipologias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/flujo-valor/lista/tipologias`);
  }

  getGerentesPorTipologia(tipologia: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/flujo-valor/lista/gerentes/${encodeURIComponent(tipologia)}`);
  }

  getFlujosPorGerente(gerente: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/flujo-valor/lista/flujos/${encodeURIComponent(gerente)}`);
  }

  getCelulasPorFlujo(flujodeValor: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/flujo-valor/lista/celulas/${encodeURIComponent(flujodeValor)}`);
  }

  getLideresPorCelula(celula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/flujo-valor/lista/lideres/${encodeURIComponent(celula)}`);
  }

  agregarFlujo(flujo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/flujo-valor`, flujo);
  }

  actualizarFlujo(id: string, flujo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/flujo-valor/${id}`, flujo);
  }

  eliminarFlujo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/flujo-valor/${id}`);
  }
}