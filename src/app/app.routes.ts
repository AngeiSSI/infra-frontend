import { Routes } from '@angular/router';

// Componentes existentes
import { LoginComponent } from './components/login/login.component';
import { DashboardEjecutivoComponent } from './pages/dashboard-ejecutivo/dashboard-ejecutivo.component';

// ✅ NUEVOS Componentes
import { InicioDashboardComponent } from './pages/inicio-dashboard/inicio-dashboard.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { ListadoActividadesComponent } from './pages/listado-actividades/listado-actividades.component';
import { DetalleActividadComponent } from './pages/detalle-actividad/detalle-actividad.component';
import { ActividadesAgrupadasComponent } from './pages/actividades-agrupadas/actividades-agrupadas.component';
import { AsignacionesComponent } from './pages/asignaciones/asignaciones.component';
import { AsignacionesMejoradoComponent } from './components/asignaciones-mejorado/asignaciones-mejorado.component';
import { AprobacionesCierreComponent } from './pages/aprobaciones-cierre/aprobaciones-cierre.component';
import { AsignacionProyectoWizardComponent } from './pages/asignacion-proyecto-wizard/asignacion-proyecto-wizard.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CatalogoServiciosComponent } from './components/catalogo-servicios/catalogo-servicios.component';
import { MacroTareasComponent } from './pages/macro-tareas/macro-tareas.component';
import { MacroTareaWizardComponent } from './components/macro-tarea-wizard/macro-tarea-wizard.component';
import { ReportesComponent } from './pages/reportes/reportes.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Login (sin protección)
  { path: 'login', component: LoginComponent },

  // ✅ RUTAS PROTEGIDAS CON AUTH GUARD
  {
    path: 'inicio',
    component: InicioDashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Inicio - Dashboard' }
  },

  {
    path: 'actividades',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ActividadesAgrupadasComponent,
        data: { title: 'Actividades' }
      },
      {
        path: 'listado',
        component: ListadoActividadesComponent,
        data: { title: 'Listado de Actividades' }
      },
      {
        path: ':id',
        component: DetalleActividadComponent,
        data: { title: 'Detalle de Actividad' }
      },
      {
        path: ':id/editar',
        component: DetalleActividadComponent,
        data: { title: 'Editar Actividad' }
      }
    ]
  },

  {
    path: 'asignaciones',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AsignacionesComponent,
        data: { title: 'Asignaciones' }
      },
      {
        path: 'capacidad',
        component: AsignacionesMejoradoComponent,
        data: { title: 'Asignaciones - Capacidad' }
      },
      {
        path: 'nuevo',
        component: AsignacionProyectoWizardComponent,
        canActivate: [RoleGuard],
        data: { 
          title: 'Nueva Asignación de Proyecto',
          roles: ['Coordinador', 'Super Administrador']
        }
      }
    ]
  },

  {
    path: 'aprobaciones-cierre',
    component: AprobacionesCierreComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Aprobaciones de Cierre',
      roles: ['Coordinador', 'Super Administrador']
    }
  },

  {
    path: 'catalogo',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CatalogoComponent,
        data: { title: 'Catálogo' }
      },
      {
        path: 'servicios',
        component: CatalogoServiciosComponent,
        data: { title: 'Catálogo de Servicios' }
      }
    ]
  },

  {
    path: 'macro-tareas',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MacroTareasComponent,
        data: { title: 'Macro Tareas' }
      },
      {
        path: 'nueva',
        component: MacroTareaWizardComponent,
        data: { title: 'Nueva Macro Tarea' }
      }
    ]
  },

  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard],
    data: { title: 'Reportes' }
  },

  {
    path: 'dashboard-ejecutivo',
    component: DashboardEjecutivoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Dashboard Ejecutivo',
      roles: ['Coordinador', 'Super Administrador', 'PMO']
    }
  },

  // Ruta comodín
  { path: '**', redirectTo: 'inicio' }
];