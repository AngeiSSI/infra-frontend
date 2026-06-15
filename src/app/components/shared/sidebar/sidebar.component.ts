import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Usuario } from '../../../models/usuario.model';

interface MenuItem {
  nombre: string;
  icono: string;
  ruta: string;
  roles?: string[];
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  usuario: Usuario | null = null;
  menuItems: MenuItem[] = [];
  menuExpandido: { [key: string]: boolean } = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuarioActual();
    this.construirMenu();
  }

  private construirMenu(): void {
    const rol = this.usuario?.rol;

    this.menuItems = [
      {
        nombre: 'Inicio',
        icono: '🏠',
        ruta: '/inicio'
      },
      {
        nombre: 'Actividades',
        icono: '📋',
        ruta: '/actividades',
        subItems: [
          {
            nombre: 'Todas',
            icono: '👁️',
            ruta: '/actividades'
          },
          {
            nombre: 'Mis Actividades',
            icono: '📌',
            ruta: '/actividades/mis-actividades'
          },
          {
            nombre: 'Listado',
            icono: '📝',
            ruta: '/actividades/listado'
          }
        ]
      },
      {
        nombre: 'Asignaciones',
        icono: '👥',
        ruta: '/asignaciones',
        subItems: [
          {
            nombre: 'Capacidad',
            icono: '📊',
            ruta: '/asignaciones/capacidad'
          },
          {
            nombre: 'Mis Proyectos',
            icono: '📁',
            ruta: '/asignaciones'
          },
          {
            nombre: 'Nueva Asignación',
            icono: '➕',
            ruta: '/asignaciones/nuevo',
            roles: ['Coordinador', 'Super Administrador']
          }
        ]
      },
      {
        nombre: 'Aprobaciones',
        icono: '✓',
        ruta: '/aprobaciones-cierre',
        roles: ['Coordinador', 'Super Administrador']
      },
      {
        nombre: 'Catálogo',
        icono: '📖',
        ruta: '/catalogo',
        subItems: [
          {
            nombre: 'Servicios',
            icono: '🔧',
            ruta: '/catalogo/servicios'
          },
          {
            nombre: 'Actividades',
            icono: '📋',
            ruta: '/catalogo'
          }
        ]
      },
      {
        nombre: 'Macro Tareas',
        icono: '📌',
        ruta: '/macro-tareas',
        subItems: [
          {
            nombre: 'Nueva',
            icono: '➕',
            ruta: '/macro-tareas/nueva'
          },
          {
            nombre: 'Ver Todas',
            icono: '👁️',
            ruta: '/macro-tareas'
          }
        ]
      },
      {
        nombre: 'Reportes',
        icono: '📊',
        ruta: '/reportes'
      },
      {
        nombre: 'Dashboard Ejecutivo',
        icono: '📈',
        ruta: '/dashboard-ejecutivo',
        roles: ['Coordinador', 'Super Administrador', 'PMO']
      }
    ];

    // Filtrar por roles
    this.menuItems = this.menuItems.filter(item => {
      if (item.roles && !item.roles.includes(rol || '')) {
        return false;
      }
      if (item.subItems) {
        item.subItems = item.subItems.filter(sub => {
          if (sub.roles && !sub.roles.includes(rol || '')) {
            return false;
          }
          return true;
        });
      }
      return true;
    });
  }

  toggleMenu(nombre: string): void {
    this.menuExpandido[nombre] = !this.menuExpandido[nombre];
  }

  logout(): void {
    this.authService.logout();
  }
}