import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponenteConCambios {
  puedoAbandonar(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponenteConCambios> {

  canDeactivate(
    component: ComponenteConCambios,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (component.puedoAbandonar()) {
      return true;
    }

    return confirm('¿Tienes cambios sin guardar. ¿Estás seguro de que deseas abandonar esta página?');
  }
}