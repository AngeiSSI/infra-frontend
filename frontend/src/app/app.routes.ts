import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CambiarPasswordComponent } from './pages/cambiar-password/cambiar-password.component';
import { ActividadesComponent } from './pages/actividades/actividades';
import { AprobacionVencimientosComponent } from './pages/actividades/aprobacion-vencimientos/aprobacion-vencimientos.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { RecuperarPasswordComponent } from './pages/recuperar-password/recuperar-password.component';
import { AsignacionComponent } from './pages/asignacion/asignacion';
import { ReportesComponent } from './pages/reportes/reportes.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cambiar-password',
    component: CambiarPasswordComponent
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordComponent
  },
  {
    path: 'actividades',
    component: ActividadesComponent,
    data: { vista: 'mis' }
  },
  {
    path: 'actividades/grupo',
    component: ActividadesComponent,
    data: { vista: 'grupo' }
  },
  {
    path: 'actividades/total',
    component: ActividadesComponent,
    data: { vista: 'total' }
  },
  {
    path: 'actividades/seguimiento',
    component: ActividadesComponent,
    data: { vista: 'seguimiento' }
  },
  {
    path: 'actividades/aprobacion-vencimientos',
    component: AprobacionVencimientosComponent
  },
  {
    path: 'reportes',
    component: ReportesComponent
  },
  {
    path: 'catalogo',
    component: CatalogoComponent
  },
  {
    path: 'asignacion',
    component: AsignacionComponent
  },
  {
    path: 'gestion-usuarios',
    component: GestionUsuariosComponent
  },
  {
    path: '',
    redirectTo: '/actividades',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];