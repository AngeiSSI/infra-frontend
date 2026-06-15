import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {

  @Input() set appHasRole(roles: string | string[]) {
    this.rolesRequeridos = typeof roles === 'string' ? [roles] : roles;
    this.verificarAcceso();
  }

  private rolesRequeridos: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.verificarAcceso();
  }

  private verificarAcceso(): void {
    const usuario = this.authService.obtenerUsuarioActual();

    if (usuario && this.rolesRequeridos.includes(usuario.rol)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}