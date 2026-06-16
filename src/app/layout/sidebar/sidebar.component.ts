import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  path?: string;
  label: string;
  icono?: string;
  submenu?: MenuItem[];
}

interface MenuStructure {
  [key: string]: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  usuario: any;
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    this.cargarMenu();
  }

  cargarMenu() {
    const rol = this.usuario?.rol?.toLowerCase() || '';

    const MENUS: MenuStructure = {
      super_admin: [
        { path: '/inicio', label: 'Inicio', icono: '🏠' },
        { path: '/dashboard-ejecutivo', label: 'Dashboard Ejecutivo', icono: '📊' },
        { path: '/dashboard-ttm', label: 'Dashboard TTM', icono: '⏱' },
        { label: 'Actividades', icono: '📋', submenu: [
          { path: '/actividades', label: 'Mis Actividades', icono: '✓' },
          { path: '/actividades/grupo', label: 'De Mi Grupo', icono: '✓' },
          { path: '/actividades/total', label: 'Total', icono: '✓' },
          { path: '/actividades/seguimiento', label: 'Seguimiento', icono: '✓' }
        ]},
        { path: '/asignacion-proyectos', label: 'Asignación de Proyectos', icono: '📁' },
        { path: '/macro-tareas', label: 'Macro Tareas', icono: '🎯' },
        { path: '/catalogo', label: 'Catálogo', icono: '📖' },
        { path: '/listas-maestras', label: 'Listas Maestras', icono: '🗂' },
        { path: '/festivos', label: 'Festivos', icono: '📅' },
        { path: '/gestion-usuarios', label: 'Usuarios', icono: '👥' },
        { path: '/auditoria', label: 'Auditoría', icono: '📝' },
        { path: '/reportes', label: 'Reportes', icono: '📈' }
      ],
      administrador: [
        { path: '/inicio', label: 'Inicio', icono: '🏠' },
        { path: '/dashboard-ejecutivo', label: 'Dashboard Ejecutivo', icono: '📊' },
        { path: '/actividades', label: 'Actividades', icono: '📋' },
        { path: '/asignacion-proyectos', label: 'Asignación', icono: '📁' },
        { path: '/macro-tareas', label: 'Macro Tareas', icono: '🎯' },
        { path: '/catalogo', label: 'Catálogo', icono: '📖' },
        { path: '/reportes', label: 'Reportes', icono: '📈' },
        { path: '/auditoria', label: 'Auditoría', icono: '📝' }
      ],
      coordinador: [
        { path: '/inicio', label: 'Inicio', icono: '🏠' },
        { path: '/dashboard-ejecutivo', label: 'Dashboard Ejecutivo', icono: '📊' },
        { path: '/actividades', label: 'Actividades', icono: '📋' },
        { path: '/asignacion-proyectos', label: 'Asignación', icono: '📁' },
        { path: '/macro-tareas', label: 'Macro Tareas', icono: '🎯' },
        { path: '/reportes', label: 'Reportes', icono: '📈' }
      ],
      lider: [
        { path: '/inicio', label: 'Inicio', icono: '🏠' },
        { path: '/actividades', label: 'Mis Actividades', icono: '📋' },
        { path: '/macro-tareas', label: 'Macro Tareas', icono: '🎯' },
        { path: '/reportes', label: 'Reportes', icono: '📈' }
      ]
    };

    const menuDefault = MENUS[rol] || MENUS['lider'];
    this.menuItems = menuDefault;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}