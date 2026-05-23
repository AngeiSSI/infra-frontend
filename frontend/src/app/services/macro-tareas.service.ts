import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface MicroTarea {
  _id?: string;
  actividad: string;
  catalogoId: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
}

export interface MacroTarea {
  _id?: string;
  nombre: string;
  descripcion: string;
  liderInfraestructuraId: string;
  liderInfraestructuraNombre: string;
  microTareas: MicroTarea[];
  diasHabiles?: number;
  estado: 'activa' | 'inactiva';
  fechaCreacion?: string;
  fechaModificacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MacroTareasService {
  private readonly API_URL = 'https://api-infra-actividades-gwevagd8g0dfaxcv.westcentralus-01.azurewebsites.net';
  private readonly storageKey = 'macro_tareas_local';

  constructor(private http: HttpClient) {}

  // Obtener todas las macro tareas
  obtenerMacroTareas(): Observable<MacroTarea[]> {
    return this.http.get<MacroTarea[]>(`${this.API_URL}/macro-tareas`).pipe(
      catchError(err => {
        console.error('Error al obtener macro tareas:', err);
        return throwError(() => err);
      })
    );
  }

  // Obtener macro tareas de un líder
  obtenerMacroTareasPorLider(liderInfraestructuraId: string): Observable<MacroTarea[]> {
    return this.http.get<MacroTarea[]>(
      `${this.API_URL}/macro-tareas?liderInfraestructuraId=${liderInfraestructuraId}`
    ).pipe(
      catchError(err => {
        console.error('Error al obtener macro tareas por líder:', err);
        return throwError(() => err);
      })
    );
  }

  // Crear macro tarea - INTENTA PRIMERO CON POST, SI FALLA GUARDA LOCAL
  crearMacroTarea(macroTarea: MacroTarea): Observable<MacroTarea> {
    console.log('Intentando crear macro tarea en API:', macroTarea);

    return new Observable(observer => {
      this.http.post<MacroTarea>(`${this.API_URL}/macro-tareas`, macroTarea).subscribe({
        next: (creada) => {
          console.log('Macro tarea creada en API');
          observer.next(creada);
          observer.complete();
        },
        error: (err) => {
          console.error('Error al crear en API (404 o similar), guardando en localStorage:', err);

          // Si falla, guardamos en localStorage con un ID temporal
          const macroTareaLocal: MacroTarea = {
            ...macroTarea,
            _id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
          };

          const tareas = this.leerDelLocal();
          tareas.push(macroTareaLocal);
          this.guardarEnLocal(tareas);

          console.log('Macro tarea guardada en localStorage:', macroTareaLocal._id);
          observer.next(macroTareaLocal);
          observer.complete();
        }
      });
    });
  }

  // Actualizar macro tarea
  actualizarMacroTarea(id: string, macroTarea: MacroTarea): Observable<MacroTarea> {
    return this.http.put<MacroTarea>(`${this.API_URL}/macro-tareas/${id}`, macroTarea).pipe(
      catchError(err => {
        console.error('Error al actualizar macro tarea:', err);
        return throwError(() => err);
      })
    );
  }

  // Eliminar macro tarea - INTENTA EN API, SI FALLA ELIMINA DE LOCAL
  eliminarMacroTarea(id: string): Observable<any> {
    console.log('Intentando eliminar macro tarea:', id);

    // Si empieza con "local_", es una del localStorage
    if (id.startsWith('local_')) {
      console.log('Eliminando del localStorage');
      const tareas = this.leerDelLocal();
      const filtradas = tareas.filter(t => t._id !== id);
      this.guardarEnLocal(filtradas);

      return new Observable(observer => {
        observer.next({ success: true, local: true });
        observer.complete();
      });
    }

    return new Observable(observer => {
      this.http.delete(`${this.API_URL}/macro-tareas/${id}`).subscribe({
        next: (result) => {
          console.log('Macro tarea eliminada de API');
          observer.next(result);
          observer.complete();
        },
        error: (err) => {
          console.error('Error al eliminar en API, intentando en localStorage:', err);

          // Si falla, intenta eliminar del localStorage
          const tareas = this.leerDelLocal();
          const filtradas = tareas.filter(t => t._id !== id);
          this.guardarEnLocal(filtradas);

          console.log('Macro tarea eliminada del localStorage');
          observer.next({ success: true, local: true });
          observer.complete();
        }
      });
    });
  }

  // Guardar en localStorage para desarrollo/backup
  guardarEnLocal(macroTareas: MacroTarea[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(macroTareas));
      console.log('Guardado en localStorage:', macroTareas.length, 'macro tareas');
    } catch (err) {
      console.error('Error al guardar en localStorage:', err);
    }
  }

  // Leer desde localStorage
  leerDelLocal(): MacroTarea[] {
    try {
      const datos = localStorage.getItem(this.storageKey);
      const resultado = datos ? JSON.parse(datos) : [];
      console.log('Leído del localStorage:', resultado.length, 'macro tareas');
      return resultado;
    } catch (err) {
      console.error('Error al leer del localStorage:', err);
      return [];
    }
  }

  // Calcular días totales de una macro tarea
  calcularDiasTotales(macroTarea: MacroTarea): number {
    if (!macroTarea || !macroTarea.microTareas || macroTarea.microTareas.length === 0) {
      return 0;
    }
    return macroTarea.microTareas.reduce((sum, micro) => sum + (micro.diasHabiles || 0), 0);
  }

  // Limpiar localStorage (para eliminar registros de prueba)
  limpiarLocal(): void {
    localStorage.removeItem(this.storageKey);
    console.log('localStorage limpiado');
  }
}