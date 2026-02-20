import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styles: [`
    .main-sidebar {
      width: 180px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
    }

    .sidebar-header {
      padding: 0 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sidebar-header h2 {
      margin: 0;
      color: white;
      font-size: 0.95rem;
      font-weight: 700;
    }

    .sidebar-main-item {
      padding: 0.75rem 1.5rem;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-left: 3px solid transparent;
      user-select: none;
    }

    .sidebar-main-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .sidebar-main-item.active {
      background: rgba(255, 255, 255, 0.15);
      border-left-color: white;
    }

    .sidebar-main-item .icon {
      font-size: 1.2rem;
    }

    .sidebar-submenu {
      background: rgba(0, 0, 0, 0.2);
      margin-left: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .sidebar-submenu.open {
      max-height: 500px;
    }

    .sidebar-subitem {
      padding: 0.5rem 1.5rem;
      padding-left: 2.5rem;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-left: 2px solid transparent;
      user-select: none;
    }

    .sidebar-subitem:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .sidebar-subitem.active {
      color: white;
      background: rgba(255, 255, 255, 0.15);
      border-left-color: white;
      font-weight: 600;
    }

    .sidebar-section {
      margin-bottom: 0;
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.85);
    }

    .sidebar-footer-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-footer-item:last-child {
      margin-bottom: 0;
    }

    .logout-btn {
      width: 100%;
      padding: 0.6rem;
      background: #d32f2f;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 0.5rem;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: #b71c1c;
    }

    .chevron {
      margin-left: auto;
      font-size: 0.8rem;
      transition: transform 0.3s;
    }

    .sidebar-main-item.expanded .chevron {
      transform: rotate(90deg);
    }
  `]
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
    console.log('👤 Usuario en Sidebar:', this.usuario);
    console.log('🔑 Rol:', this.usuario?.rol);
  }

  toggleSubmenu(): void {
    this.submenuOpen = !this.submenuOpen;
    console.log('🔓 Submenu abierto:', this.submenuOpen);
  }

  navigateTo(ruta: string): void {
    console.log('🔀 Navegando a:', ruta);
    this.activeMenuItem = ruta;
    this.submenuOpen = false;
    this.router.navigate([`/${ruta}`]);
  }

  setActiveMenu(item: string): void {
    console.log('📍 Seleccionando item:', item);
    this.activeMenuItem = item;
    this.submenuOpen = false;
    
    console.log('🎯 Navegando a:', item);
    
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
    }
  }

  puedeVerTotal(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
    console.log('✅ Puede ver Total:', puede, 'Rol:', rol);
    return puede;
  }

  puedeVerSeguimiento(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
    console.log('✅ Puede ver Seguimiento:', puede, 'Rol:', rol);
    return puede;
  }

  puedeVerGestionUsuarios(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const puede = rol === 'coordinador' || rol === 'administrador';
    console.log('��� Puede ver Usuarios:', puede, 'Rol:', rol);
    return puede;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}