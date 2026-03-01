import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
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
    console.log('👤 Usuario en sidebar:', this.usuario);
    
    // Actualizar el menú activo basado en la ruta actual
    this.actualizarMenuActivo();
    
    // Escuchar cambios de ruta para actualizar el menú
    this.router.events.subscribe(() => {
      this.actualizarMenuActivo();
    });
  }

  /**
   * Actualiza el menú activo según la ruta actual
   */
  actualizarMenuActivo(): void {
    const url = this.router.url;
    console.log('📍 Ruta actual:', url);

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
    } else if (url.includes('reportes')) {
      this.activeMenuItem = 'reportes';
      this.submenuOpen = false;
    } else if (url.includes('catalogo')) {
      this.activeMenuItem = 'catalogo';
      this.submenuOpen = false;
    } else if (url.includes('asignacion')) {
      this.activeMenuItem = 'asignacion';
      this.submenuOpen = false;
    } else if (url.includes('gestion-usuarios')) {
      this.activeMenuItem = 'gestion-usuarios';
      this.submenuOpen = false;
    }
  }

  toggleSubmenu(): void {
    console.log('🔄 Toggling submenu:', !this.submenuOpen);
    this.submenuOpen = !this.submenuOpen;
  }

  navigateTo(ruta: string): void {
    console.log('🔗 Navegando a:', ruta);
    
    // Validar permisos para usuarios
    if (ruta === 'gestion-usuarios' && !this.puedeVerGestionUsuarios()) {
      console.log('❌ No tienes permisos para acceder a Gestión de Usuarios');
      return;
    }
    
    this.activeMenuItem = ruta;
    this.submenuOpen = false;
    console.log('➡️ Ruta final:', `/${ruta}`);
    this.router.navigate([`/${ruta}`]);
  }

  setActiveMenu(item: string): void {
    console.log('📌 Estableciendo menú activo:', item);
    this.activeMenuItem = item;
    
    if (item === 'mis-actividades') {
      console.log('➡️ Navegando a /actividades');
      this.router.navigate(['/actividades']);
    } else if (item === 'grupo') {
      console.log('➡️ Navegando a /actividades/grupo');
      this.router.navigate(['/actividades/grupo']);
    } else if (item === 'total') {
      console.log('➡️ Navegando a /actividades/total');
      this.router.navigate(['/actividades/total']);
    } else if (item === 'seguimiento') {
      console.log('➡️ Navegando a /actividades/seguimiento');
      this.router.navigate(['/actividades/seguimiento']);
    } else if (item === 'aprobacion') {
      console.log('➡️ Navegando a /actividades/aprobacion-vencimientos');
      this.router.navigate(['/actividades/aprobacion-vencimientos']);
    }
  }

  puedeVerTotal(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerTotal para', rol, ':', puede);
    return puede;
  }

  puedeVerSeguimiento(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerSeguimiento para', rol, ':', puede);
    return puede;
  }

  puedeVerAprobacionVencimientos(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerAprobacionVencimientos para', rol, ':', puede);
    return puede;
  }

  puedeVerGestionUsuarios(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerGestionUsuarios para', rol, ':', puede);
    return puede;
  }

  logout(): void {
    console.log('🚪 Cerrando sesión');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}