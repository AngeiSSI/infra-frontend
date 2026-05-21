import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  host: {
    style: 'display: block; flex-shrink: 0;'
  }
})
export class SidebarComponent implements OnInit {
  usuario: any = null;
  activeMenuItem: string = 'mis-actividades';
  submenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.actualizarMenuActivo();

    this.router.events.subscribe(() => {
      this.actualizarMenuActivo();
    });
  }

  actualizarMenuActivo(): void {
    const url = this.router.url;

    if (url.includes('actividades/aprobacion-vencimientos')) {
      this.activeMenuItem = 'aprobacion';
      this.submenuOpen = true;
    } else if (url.includes('actividades/seguimiento')) {
      this.activeMenuItem = 'seguimiento';
      this.submenuOpen = true;
    } else if (url.includes('actividades/total')) {
      this.activeMenuItem = 'total';
      this.submenuOpen = true;
    } else if (url.includes('actividades/grupo')) {
      this.activeMenuItem = 'grupo';
      this.submenuOpen = true;
    } else if (url.includes('actividades') && !url.includes('actividades/')) {
      this.activeMenuItem = 'mis-actividades';
      this.submenuOpen = true;
    } else if (url.includes('asignacion-proyectos')) {
      this.activeMenuItem = 'asignacion-proyectos';
      this.submenuOpen = false;
    } else if (url.includes('macro-tareas')) {
      this.activeMenuItem = 'macro-tareas';
      this.submenuOpen = false;
    } else if (url.includes('reportes')) {
      this.activeMenuItem = 'reportes';
      this.submenuOpen = false;
    } else if (url.includes('catalogo')) {
      this.activeMenuItem = 'catalogo';
      this.submenuOpen = false;
    } else if (url.includes('festivos')) {
      this.activeMenuItem = 'festivos';
      this.submenuOpen = false;
    } else if (url.includes('asignacion')) {
      this.activeMenuItem = 'asignacion';
      this.submenuOpen = false;
    } else if (url.includes('listas-maestras')) {
      this.activeMenuItem = 'listas-maestras';
      this.submenuOpen = false;
    } else if (url.includes('gestion-usuarios')) {
      this.activeMenuItem = 'gestion-usuarios';
      this.submenuOpen = false;
    }
  }

  toggleSubmenu(): void {
    this.submenuOpen = !this.submenuOpen;
  }

  navigateTo(ruta: string): void {
    this.activeMenuItem = ruta;
    this.submenuOpen = false;
    this.router.navigate([`/${ruta}`]);
  }

  setActiveMenu(item: string): void {
    this.activeMenuItem = item;

    if (item === 'mis-actividades') {
      this.router.navigate(['/actividades']);
    } else if (item === 'grupo') {
      this.router.navigate(['/actividades/grupo']);
    } else if (item === 'total') {
      this.router.navigate(['/actividades/total']);
    } else if (item === 'seguimiento') {
      this.router.navigate(['/actividades/seguimiento']);
    } else if (item === 'aprobacion') {
      this.router.navigate(['/actividades/aprobacion-vencimientos']);
    }
  }

  puedeVerTotal(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerSeguimiento(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerAprobacionVencimientos(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerGestionUsuarios(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerReportes(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerCatalogo(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerFestivos(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerAsignacion(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerAsignacionProyectos(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerMacroTareas(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  puedeVerListasMaestras(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  esAdministrador(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'administrador' || rol === 'super_admin';
  }

  esSuperAdmin(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'super_admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}