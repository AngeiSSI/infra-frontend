import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],  /* ← AGREGÁ CommonModule */
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})

export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isAuthenticated = true;
  isLoginPage = false;
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar autenticación inicial
    this.usuario = this.authService.getUsuario();
    this.isAuthenticated = !!this.usuario;
    this.checkIfLoginPage();

    // Escuchar cambios de ruta
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Actualizar estado de autenticación
        this.usuario = this.authService.getUsuario();
        this.isAuthenticated = !!this.usuario;
        this.checkIfLoginPage();
      });
  }

  private checkIfLoginPage(): void {
    // No mostrar sidebar en login, cambiar-password, recuperar-password
    const loginPages = ['/login', '/cambiar-password', '/recuperar-password'];
    this.isLoginPage = loginPages.some(page => this.router.url.includes(page));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}