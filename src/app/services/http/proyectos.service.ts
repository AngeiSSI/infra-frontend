import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto, MacroTareaProyecto } from '../../models/proyecto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private apiUrl = `${environment.apiUrl}/proyectos`;
  private macroTareasUrl = `${environment.apiUrl}/macro-tareas`;
  private catalogoUrl = `${environment.apiUrl}/catalogo`;

  constructor(private http: HttpClient) { }

  // CRUD Proyectos
  obtenerTodos(filtros?: any): Observable<any> {
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

  obtenerPorId(id: string): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  crear(proyecto: Proyecto): Observable<any> {
    return this.http.post<any>(this.apiUrl, proyecto);
  }

  actualizar(id: string, proyecto: Partial<Proyecto>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyecto);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Macro Tareas
  obtenerMacroTareas(): Observable<MacroTareaProyecto[]> {
    return this.http.get<MacroTareaProyecto[]>(this.macroTareasUrl);
  }

  obtenerMacroTareasProyecto(proyectoId: string): Observable<MacroTareaProyecto[]> {
    return this.http.get<MacroTareaProyecto[]>(`${this.apiUrl}/${proyectoId}/macro-tareas`);
  }

  crearMacroTarea(macroTarea: MacroTareaProyecto): Observable<any> {
    return this.http.post<any>(this.macroTareasUrl, macroTarea);
  }

  // Catálogo
  obtenerCatalogo(): Observable<any[]> {
    return this.http.get<any[]>(this.catalogoUrl);
  }

  obtenerTipificaciones(): Observable<any> {
    return this.http.get<any>(`${this.catalogoUrl}/tipificaciones`);
  }

  crearActividadCatalogo(actividad: any): Observable<any> {
    return this.http.post<any>(this.catalogoUrl, actividad);
  }

  aprobarActividadCatalogo(actividadId: string): Observable<any> {
    return this.http.patch<any>(`${this.catalogoUrl}/${actividadId}/aprobar`, {});
  }

  rechazarActividadCatalogo(actividadId: string, observaciones: string): Observable<any> {
    return this.http.patch<any>(`${this.catalogoUrl}/${actividadId}/rechazar`, { observaciones });
  }
}