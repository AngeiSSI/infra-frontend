import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActividadesService, Actividad, JustificacionCierre } from '../../../services/actividades.service';
import { AuthService } from '../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-aprobacion-vencimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './aprobacion-vencimientos.html',
  styles: [`
    .header {
      background: white;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-bottom: 3px solid #CC0000;
      flex-shrink: 0;
    }

    .header h1 {
      margin: 0 0 0.5rem 0;
      color: #CC0000;
      font-size: 1.8rem;
      font-weight: 800;
    }

    .header-subtitle {
      margin: 0;
      color: #999;
      font-size: 0.9rem;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      background: #F5F5F5;
    }

    .alert {
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid;
      margin-bottom: 1rem;
    }

    .alert-danger {
      background: #FFEBEE;
      color: #CC0000;
      border-left-color: #CC0000;
    }

    .alert-success {
      background: #E8F5E9;
      color: #2E7D32;
      border-left-color: #2E7D32;
    }

    .alert-info {
      background: #E3F2FD;
      color: #1976d2;
      border-left-color: #1976d2;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-top: 4px solid #CC0000;
    }

    .stat-label {
      margin: 0 0 0.5rem 0;
      color: #999;
      font-size: 0.85rem;
      text-transform: uppercase;
      font-weight: 600;
    }

    .stat-number {
      margin: 0;
      color: #CC0000;
      font-size: 2rem;
      font-weight: 800;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      color: #CC0000;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 8px;
      color: #999;
    }

    .tarjeta-vencimiento {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #CC0000;
    }

    .tarjeta-header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: start;
    }

    .tarjeta-titulo {
      margin: 0 0 0.5rem 0;
      color: #CC0000;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .tarjeta-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .info-item {
      background: #F5F5F5;
      padding: 0.75rem;
      border-radius: 6px;
    }

    .info-label {
      font-size: 0.8rem;
      color: #999;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .info-value {
      font-size: 0.95rem;
      color: #333;
      font-weight: 600;
    }

    .justificacion-box {
      background: #FFF3E0;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #F57C00;
    }

    .justificacion-box h4 {
      margin: 0 0 0.75rem 0;
      color: #F57C00;
      font-size: 0.95rem;
      font-weight: 700;
    }

    .justificacion-texto {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      color: #555;
      line-height: 1.6;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      border: 1px solid #E0E0E0;
    }

    .justificacion-meta {
      font-size: 0.8rem;
      color: #999;
    }

    .acciones-box {
      background: #F5F5F5;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .acciones-titulo {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .comentario-form {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      min-height: 80px;
    }

    textarea:focus {
      outline: none;
      border-color: #CC0000;
      box-shadow: 0 0 0 3px rgba(204, 0, 0, 0.1);
    }

    .botones-accion {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .btn-success {
      background: #4CAF50;
      color: white;
    }

    .btn-success:hover {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
    }

    .btn-danger {
      background: #CC0000;
      color: white;
    }

    .btn-danger:hover {
      background: #AA0000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(204, 0, 0, 0.2);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .estado-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-pendiente {
      background: #FFF3E0;
      color: #F57C00;
    }

    .badge-aprobado {
      background: #E8F5E9;
      color: #2E7D32;
    }

    .badge-rechazado {
      background: #FFEBEE;
      color: #CC0000;
    }

    .filtro-section {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #CC0000;
    }

    .filtro-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .filtro-item {
      display: flex;
      flex-direction: column;
    }

    .filtro-item label {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .filtro-item select {
      padding: 0.5rem;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .filtro-item select:focus {
      outline: none;
      border-color: #CC0000;
    }

    .btn-secondary {
      background: #F0F0F0;
      color: #333;
      border: 2px solid #E0E0E0;
    }

    .btn-secondary:hover {
      background: #E8E8E8;
      border-color: #CC0000;
      color: #CC0000;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #E0E0E0;
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      color: #999;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .tab-btn.active {
      color: #CC0000;
      border-bottom-color: #CC0000;
    }

    .tab-btn:hover {
      color: #CC0000;
    }
  `]
})
export class AprobacionVencimientosComponent implements OnInit {
  actividades: Actividad[] = [];
  actividadesPendientes: Actividad[] = [];
  actividadesAprobadas: Actividad[] = [];
  actividadesRechazadas: Actividad[] = [];

  loading = false;
  error = '';
  usuario: any = null;

  comentarioForm: { [key: string]: string } = {};
  tabActivo: 'pendientes' | 'aprobadas' | 'rechazadas' = 'pendientes';

  filtroLider: string = '';
  filtroProyecto: string = '';
  lideresDisponibles: string[] = [];
  proyectosDisponibles: string[] = [];

  constructor(
    private actividadesService: ActividadesService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar permisos
    const rol = this.usuario.rol?.toLowerCase();
    if (rol !== 'coordinador' && rol !== 'administrador') {
      this.error = 'No tienes permisos para acceder a esta sección';
      setTimeout(() => this.router.navigate(['/actividades']), 2000);
      return;
    }

    this.cargarActividades();
  }

  cargarActividades(): void {
    this.loading = true;
    this.actividadesService.getActividades().subscribe({
      next: (data) => {
        // Filtrar solo actividades en estado "pendiente validacion"
        this.actividades = data.filter(a => a.estado === 'pendiente validacion');
        
        this.filtrarActividades();
        this.cargarFiltros();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Error al cargar actividades: ' + (err.error?.message || err.statusText);
        this.loading = false;
      }
    });
  }

  cargarFiltros(): void {
    const lideresSet = new Set<string>();
    const proyectosSet = new Set<string>();
    
    this.actividades.forEach(a => {
      lideresSet.add(a.lider);
      proyectosSet.add(a.proyecto);
    });

    this.lideresDisponibles = Array.from(lideresSet).sort();
    this.proyectosDisponibles = Array.from(proyectosSet).sort();
  }

  filtrarActividades(): void {
    let filtrado = this.actividades;

    if (this.filtroLider) {
      filtrado = filtrado.filter(a => a.lider === this.filtroLider);
    }

    if (this.filtroProyecto) {
      filtrado = filtrado.filter(a => a.proyecto === this.filtroProyecto);
    }

    switch (this.tabActivo) {
      case 'pendientes':
        this.actividadesPendientes = filtrado.filter(a => !a.justificacionCierre?.estado || a.justificacionCierre.estado === 'pendiente');
        break;
      case 'aprobadas':
        this.actividadesAprobadas = filtrado.filter(a => a.justificacionCierre?.estado === 'aprobado');
        break;
      case 'rechazadas':
        this.actividadesRechazadas = filtrado.filter(a => a.justificacionCierre?.estado === 'rechazado');
        break;
    }
  }

  cambiarTab(tab: 'pendientes' | 'aprobadas' | 'rechazadas'): void {
    this.tabActivo = tab;
    this.filtrarActividades();
  }

  aplicarFiltros(): void {
    this.filtrarActividades();
  }

  limpiarFiltros(): void {
    this.filtroLider = '';
    this.filtroProyecto = '';
    this.filtrarActividades();
  }

  aprobarCierre(actividadId: string | undefined): void {
    if (!actividadId) return;

    if (!this.comentarioForm[actividadId]?.trim()) {
      this.error = 'Debes agregar un comentario';
      return;
    }

    if (!confirm('¿Está seguro de aprobar el cierre de esta actividad?')) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.actividadesService.aprobarCierre(actividadId, this.comentarioForm[actividadId]).subscribe({
      next: (actividadActualizada: Actividad) => {
        const index = this.actividades.findIndex(a => a._id === actividadId);
        if (index !== -1) {
          this.actividades[index] = actividadActualizada;
        }
        this.comentarioForm[actividadId] = '';
        this.filtrarActividades();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Error al aprobar: ' + (err.error?.message || err.statusText);
      }
    });
  }

  rechazarCierre(actividadId: string | undefined): void {
    if (!actividadId) return;

    if (!this.comentarioForm[actividadId]?.trim()) {
      this.error = 'Debes agregar un motivo de rechazo';
      return;
    }

    if (!confirm('¿Está seguro de rechazar el cierre de esta actividad? El líder deberá corregir la justificación.')) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.actividadesService.rechazarCierre(actividadId, this.comentarioForm[actividadId]).subscribe({
      next: (actividadActualizada: Actividad) => {
        const index = this.actividades.findIndex(a => a._id === actividadId);
        if (index !== -1) {
          this.actividades[index] = actividadActualizada;
        }
        this.comentarioForm[actividadId] = '';
        this.filtrarActividades();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Error al rechazar: ' + (err.error?.message || err.statusText);
      }
    });
  }

  contarPendientes(): number {
    return this.actividades.filter(a => !a.justificacionCierre?.estado || a.justificacionCierre.estado === 'pendiente').length;
  }

  contarAprobadas(): number {
    return this.actividades.filter(a => a.justificacionCierre?.estado === 'aprobado').length;
  }

  contarRechazadas(): number {
    return this.actividades.filter(a => a.justificacionCierre?.estado === 'rechazado').length;
  }

  obtenerActividadesAMostrar(): Actividad[] {
    switch (this.tabActivo) {
      case 'pendientes':
        return this.actividadesPendientes;
      case 'aprobadas':
        return this.actividadesAprobadas;
      case 'rechazadas':
        return this.actividadesRechazadas;
      default:
        return [];
    }
  }
}