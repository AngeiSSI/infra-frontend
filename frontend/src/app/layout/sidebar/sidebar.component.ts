import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <!-- Header del Sidebar -->
      <div class="sidebar-header">
        <h2 *ngIf="!isCollapsed">📋 Sistema Infra</h2>
        <button class="btn-toggle" (click)="toggleSidebar()">
          {{ isCollapsed ? '→' : '←' }}
        </button>
      </div>

      <!-- Menú -->
      <nav class="sidebar-menu">
        <a 
          routerLink="/actividades" 
          routerLinkActive="active"
          class="menu-item"
        >
          <span class="icon">📊</span>
          <span *ngIf="!isCollapsed" class="label">Actividades</span>
        </a>

        <!-- Catálogo de Servicios - Todos pueden ver -->
        <a 
          routerLink="/catalogo" 
          routerLinkActive="active"
          class="menu-item"
        >
          <span class="icon">📚</span>
          <span *ngIf="!isCollapsed" class="label">Catálogo de Servicios</span>
        </a>

        <!-- Gestión de Usuarios - Solo Coordinador/Admin -->
        <a 
          *ngIf="mostrarGestionUsuarios()"
          routerLink="/gestion-usuarios" 
          routerLinkActive="active"
          class="menu-item"
        >
          <span class="icon">👥</span>
          <span *ngIf="!isCollapsed" class="label">Gestión de Usuarios</span>
        </a>
      </nav>

      <!-- Footer del Sidebar -->
      <div class="sidebar-footer">
        <div *ngIf="!isCollapsed" class="user-info">
          <p class="user-name">{{ usuario?.nombre }}</p>
          <p class="user-rol">{{ usuario?.rol }}</p>
        </div>
        <button class="btn-logout" (click)="logout()" title="Cerrar sesión">
          🚪
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.2rem;
      white-space: nowrap;
    }

    .btn-toggle {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .btn-toggle:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .sidebar-menu {
      flex: 1;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s;
      border-left: 4px solid transparent;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-left-color: white;
    }

    .menu-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-left-color: white;
    }

    .icon {
      font-size: 1.3rem;
      min-width: 1.5rem;
    }

    .label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 2px solid rgba(255, 255, 255, 0.2);
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      margin: 0;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.9rem;
    }

    .user-rol {
      margin: 0.25rem 0 0 0;
      font-size: 0.75rem;
      opacity: 0.8;
      text-transform: capitalize;
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.6rem 0.8rem;
      border-radius: 4px;
      font-size: 1.1rem;
      transition: background 0.3s;
      white-space: nowrap;
    }

    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .label {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  usuario: any = null;
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    console.log('👤 Usuario en Sidebar:', this.usuario);
    console.log('🔑 Rol:', this.usuario?.rol);
    
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.cdr.detectChanges();
  }

  mostrarGestionUsuarios(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    const mostrar = rol === 'coordinador' || rol === 'administrador';
    console.log('👥 Mostrar Gestión de Usuarios:', mostrar, 'Rol:', this.usuario?.rol);
    return mostrar;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}