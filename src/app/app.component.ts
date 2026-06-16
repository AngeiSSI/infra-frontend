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
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isAuthenticated = false;
  isLoginPage = false;
  usuario: any = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.isAuthenticated = !!this.usuario;
    this.checkIfLoginPage();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.usuario = this.authService.getUsuario();
        this.isAuthenticated = !!this.usuario;
        this.checkIfLoginPage();
      });
  }

  private checkIfLoginPage(): void {
    const loginPages = ['/login', '/cambiar-password', '/recuperar-password'];
    this.isLoginPage = loginPages.some(page => this.router.url.includes(page));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}