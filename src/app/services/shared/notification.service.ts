import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id?: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  mensaje: string;
  duracion?: number;
  icono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();

  constructor() { }

  mostrar(notificacion: Notificacion): void {
    const id = this.generarId();
    const notif = { ...notificacion, id };

    const notificaciones = this.notificacionesSubject.value;
    this.notificacionesSubject.next([...notificaciones, notif]);

    if (notificacion.duracion) {
      setTimeout(() => {
        this.eliminar(id);
      }, notificacion.duracion);
    }
  }

  exito(mensaje: string, duracion = 3000): void {
    this.mostrar({
      tipo: 'success',
      mensaje,
      duracion,
      icono: '✓'
    });
  }

  error(mensaje: string, duracion = 5000): void {
    this.mostrar({
      tipo: 'error',
      mensaje,
      duracion,
      icono: '✕'
    });
  }

  advertencia(mensaje: string, duracion = 4000): void {
    this.mostrar({
      tipo: 'warning',
      mensaje,
      duracion,
      icono: '⚠'
    });
  }

  informacion(mensaje: string, duracion = 3000): void {
    this.mostrar({
      tipo: 'info',
      mensaje,
      duracion,
      icono: 'ℹ'
    });
  }

  eliminar(id?: string): void {
    if (id) {
      const notificaciones = this.notificacionesSubject.value.filter(n => n.id !== id);
      this.notificacionesSubject.next(notificaciones);
    } else {
      this.notificacionesSubject.next([]);
    }
  }

  private generarId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}