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
      width: 260px;
      background: #FFFFFF;
      padding: 0;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      border-right: 3px solid #CC0000;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid #F0F0F0;
      background: #FAFAFA;
    }

.sidebar-logo-container {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: #CC0000;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(204, 0, 0, 0.2);
  padding: 0.5rem;
}

.sidebar-logo {
  height: 60px;
  width: auto;
  object-fit: contain;
}
    .sidebar-header h2 {
      margin: 0;
      color: #CC0000;
      font-size: 1.3rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
    }

    .sidebar-main-item {
      padding: 1rem 1.5rem;
      color: #333;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-left: 4px solid transparent;
      user-select: none;
    }

    .sidebar-main-item:hover {
      background: #F5F5F5;
      border-left-color: #CC0000;
      color: #CC0000;
    }

    .sidebar-main-item.active {
      background: #FFF0F0;
      border-left-color: #CC0000;
      color: #CC0000;
      font-weight: 700;
    }

    .sidebar-main-item .icon {
      font-size: 1.4rem;
    }

    .sidebar-submenu {
      background: #FAFAFA;
      margin-left: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      border-bottom: 1px solid #F0F0F0;
    }

    .sidebar-submenu.open {
      max-height: 500px;
      border-bottom: 2px solid #CC0000;
    }

    .sidebar-subitem {
      padding: 0.75rem 1.5rem;
      padding-left: 3rem;
      color: #555;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-left: 3px solid transparent;
      user-select: none;
    }

    .sidebar-subitem:hover {
      color: #CC0000;
      background: #F5F5F5;
      border-left-color: #CC0000;
    }

    .sidebar-subitem.active {
      color: #CC0000;
      background: #FFF0F0;
      border-left-color: #CC0000;
      font-weight: 700;
    }

    .sidebar-section {
      margin-bottom: 0;
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 1.5rem;
      border-top: 2px solid #F0F0F0;
      font-size: 0.85rem;
      color: #666;
    }

    .sidebar-footer-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-footer-item strong {
      color: #CC0000;
      font-weight: 700;
    }

    .logout-btn {
      width: 100%;
      padding: 0.75rem;
      background: #CC0000;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 700;
      margin-top: 1rem;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .logout-btn:hover {
      background: #AA0000;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(204, 0, 0, 0.2);
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
    this.submenuOpen = false;
    
    if (item === 'mis-actividades') {
      this.router.navigate(['/actividades']);
    } else if (item === 'grupo') {
      this.router.navigate(['/actividades/grupo']);
    } else if (item === 'total') {
      this.router.navigate(['/actividades/total']);
    } else if (item === 'seguimiento') {
      this.router.navigate(['/actividades/seguimiento']);
    }
  }

  puedeVerTotal(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
  }

  puedeVerSeguimiento(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
  }

  puedeVerGestionUsuarios(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}