import { Routes } from '@angular/router';

// Componentes existentes


// ✅ NUEVOS Componentes

import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { MacroTareasComponent } from './pages/macro-tareas/macro-tareas.component';
import { ReportesComponent } from './pages/reportes/reportes.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    {
    path: 'catalogo',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CatalogoComponent,
        data: { title: 'Catálogo' }
      },
     
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
      
    ]
  },

  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard],
    data: { title: 'Reportes' }
  },

   // Ruta comodín
  { path: '**', redirectTo: 'inicio' }
];