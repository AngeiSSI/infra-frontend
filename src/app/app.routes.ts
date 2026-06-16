import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardEjecutivoComponent } from './components/dashboard-ejecutivo/dashboard-ejecutivo.component';
import { DashboardTTMComponent } from './components/dashboard-ttm/dashboard-ttm.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard-ejecutivo', component: DashboardEjecutivoComponent },
  { path: 'dashboard-ttm', component: DashboardTTMComponent },
  { path: 'auditoria', component: AuditoriaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];