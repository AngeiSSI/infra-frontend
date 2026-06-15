import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  guardar(clave: string, valor: any): void {
    try {
      const valorJson = typeof valor === 'string' ? valor : JSON.stringify(valor);
      localStorage.setItem(clave, valorJson);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  obtener(clave: string): any {
    try {
      const valor = localStorage.getItem(clave);
      if (!valor) return null;

      try {
        return JSON.parse(valor);
      } catch {
        return valor;
      }
    } catch (error) {
      console.error('Error obteniendo de localStorage:', error);
      return null;
    }
  }

  eliminar(clave: string): void {
    try {
      localStorage.removeItem(clave);
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  limpiar(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  existe(clave: string): boolean {
    return localStorage.getItem(clave) !== null;
  }

  // Session Storage
  guardarEnSesion(clave: string, valor: any): void {
    try {
      const valorJson = typeof valor === 'string' ? valor : JSON.stringify(valor);
      sessionStorage.setItem(clave, valorJson);
    } catch (error) {
      console.error('Error guardando en sessionStorage:', error);
    }
  }

  obtenerDeSesion(clave: string): any {
    try {
      const valor = sessionStorage.getItem(clave);
      if (!valor) return null;

      try {
        return JSON.parse(valor);
      } catch {
        return valor;
      }
    } catch (error) {
      console.error('Error obteniendo de sessionStorage:', error);
      return null;
    }
  }

  eliminarDeSesion(clave: string): void {
    try {
      sessionStorage.removeItem(clave);
    } catch (error) {
      console.error('Error eliminando de sessionStorage:', error);
    }
  }

  limpiarSesion(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error limpiando sessionStorage:', error);
    }
  }
}