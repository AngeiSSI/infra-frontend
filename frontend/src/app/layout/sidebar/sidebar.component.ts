import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
<<<<<<< HEAD
  styleUrls: ['./sidebar.css'],
  host: {
    style: 'display: block; flex-shrink: 0;'
  }
=======
  styleUrls: ['./sidebar.css']
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
    this.actualizarMenuActivo();
    
=======
    console.log('👤 Usuario en sidebar:', this.usuario);
    
    // Actualizar el menú activo basado en la ruta actual
    this.actualizarMenuActivo();
    
    // Escuchar cambios de ruta para actualizar el menú
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    this.router.events.subscribe(() => {
      this.actualizarMenuActivo();
    });
  }

<<<<<<< HEAD
  actualizarMenuActivo(): void {
    const url = this.router.url;
=======
  /**
   * Actualiza el menú activo según la ruta actual
   */
  actualizarMenuActivo(): void {
    const url = this.router.url;
    console.log('📍 Ruta actual:', url);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

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
<<<<<<< HEAD
    } else if (url.includes('festivos')) {
      this.activeMenuItem = 'festivos';
      this.submenuOpen = false;
    } else if (url.includes('flujo-valor')) {
      this.activeMenuItem = 'flujo-valor';
      this.submenuOpen = false;
=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    } else if (url.includes('asignacion')) {
      this.activeMenuItem = 'asignacion';
      this.submenuOpen = false;
    } else if (url.includes('gestion-usuarios')) {
      this.activeMenuItem = 'gestion-usuarios';
      this.submenuOpen = false;
    }
  }

  toggleSubmenu(): void {
<<<<<<< HEAD
=======
    console.log('🔄 Toggling submenu:', !this.submenuOpen);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    this.submenuOpen = !this.submenuOpen;
  }

  navigateTo(ruta: string): void {
<<<<<<< HEAD
    this.activeMenuItem = ruta;
    this.submenuOpen = false;
=======
    console.log('🔗 Navegando a:', ruta);
    
    // Validar permisos para usuarios
    if (ruta === 'gestion-usuarios' && !this.puedeVerGestionUsuarios()) {
      console.log('❌ No tienes permisos para acceder a Gestión de Usuarios');
      return;
    }
    
    this.activeMenuItem = ruta;
    this.submenuOpen = false;
    console.log('➡️ Ruta final:', `/${ruta}`);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    this.router.navigate([`/${ruta}`]);
  }

  setActiveMenu(item: string): void {
<<<<<<< HEAD
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
=======
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
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.router.navigate(['/actividades/aprobacion-vencimientos']);
    }
  }

  puedeVerTotal(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
<<<<<<< HEAD
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
=======
    const puede = rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerTotal para', rol, ':', puede);
    return puede;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  puedeVerSeguimiento(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
<<<<<<< HEAD
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
=======
    const puede = rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerSeguimiento para', rol, ':', puede);
    return puede;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  puedeVerAprobacionVencimientos(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
<<<<<<< HEAD
    return rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
=======
    const puede = rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerAprobacionVencimientos para', rol, ':', puede);
    return puede;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  }

  puedeVerGestionUsuarios(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
<<<<<<< HEAD
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

  puedeVerFlujoValor(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'administrador' || rol === 'super_admin' || rol === 'coordinador' || rol === 'senior';
  }

  puedeVerAsignacion(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
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
=======
    const puede = rol === 'coordinador' || rol === 'administrador';
    console.log('🔐 puedeVerGestionUsuarios para', rol, ':', puede);
    return puede;
  }

  logout(): void {
    console.log('🚪 Cerrando sesión');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}