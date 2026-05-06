import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FestivosService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Obtener TODOS los festivos
   */
  getFestivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/festivos`);
  }

  /**
   * Obtener festivos por año
   */
  getFestivosPorAnio(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/festivos?anio=${anio}`);
  }

  /**
   * Agregar UN SOLO festivo
   */
  agregarFestivo(fecha: string, descripcion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/festivos`, { 
      fecha, 
      descripcion 
    });
  }

  /**
   * Guardar TODOS los festivos (reemplaza el año completo)
   */
  guardarFestivos(festivos: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/festivos/guardar`, { festivos });
  }

  /**
   * Eliminar UN festivo
   */
  eliminarFestivo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/festivos/${id}`);
  }
}