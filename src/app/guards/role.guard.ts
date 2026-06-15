import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return false;
    }

    const rolesRequeridos = route.data['roles'] as string[];

    if (rolesRequeridos && rolesRequeridos.length > 0) {
      const usuario = this.authService.obtenerUsuarioActual();

      if (usuario && rolesRequeridos.includes(usuario.rol)) {
        return true;
      }

      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}