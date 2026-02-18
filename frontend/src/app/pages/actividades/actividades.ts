import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActividadesService, Catalogo, Actividad } from '../../services/actividades.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

// ✅ INTERFAZ OBSERVACIÓN
export interface Observacion {
  fecha: Date;
  comentario: string;
  usuario?: string;   // ✅ NUEVO: Quién hizo la observación
  rol?: string;       // ✅ NUEVO: Rol del usuario
}

// ✅ INTERFAZ DEBE ESTAR ANTES DEL @Component
export interface ActividadComponentInterface {
  _id?: string;
  lider: string;
  proyecto: string;
  tipificacion: string;
  actividadCatalogo: string;
  descripcion: string;
  estado: string;
  estadoCaso?: string;
  horas: number;
  horasAcumuladas?: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaCierre?: Date;
  observaciones?: Observacion[];  // ✅ AHORA USA LA INTERFAZ OBSERVACION
}

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './actividades.html',
  styles: [`
    .actividades-container {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .header {
      background: white;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .header-left {
      flex: 1;
    }

    .header-left h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.8rem;
    }

    .user-info {
      margin: 0;
      color: #999;
      font-size: 0.9rem;
    }

    .btn-logout {
      padding: 0.6rem 1.2rem;
      background: #d32f2f;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
      white-space: nowrap;
    }

    .btn-logout:hover {
      background: #b71c1c;
    }

    .alert {
      margin: 1rem;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid;
    }

    .alert-danger {
      background: #ffebee;
      color: #d32f2f;
      border-left-color: #d32f2f;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-card.stat-danger {
      background: #ffebee;
    }

    .stat-label {
      margin: 0 0 0.5rem 0;
      color: #999;
      font-size: 0.9rem;
    }

    .stat-number {
      margin: 0;
      color: #333;
      font-size: 2rem;
      font-weight: 700;
    }

    .formulario-section {
      padding: 1.5rem;
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .formulario-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .formulario-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }

    input,
    select,
    textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-success {
      padding: 0.75rem 1.5rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-success:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .actividades-section {
      padding: 1.5rem;
    }

    .actividades-section h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      color: #667eea;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 8px;
      color: #999;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .tabla-wrapper {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }

    .tabla {
      width: 100%;
      border-collapse: collapse;
    }

    .tabla thead {
      background: #f5f5f5;
      border-bottom: 2px solid #ddd;
    }

    .tabla th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }

    .tabla td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .tabla tbody tr {
      transition: background 0.2s;
    }

    .tabla tbody tr:hover {
      background: #fafafa;
    }

    .estado-danger {
      background: #ffebee !important;
    }

    .estado-warning {
      background: #fff3e0 !important;
    }

    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-en\ progreso {
      background: #e3f2fd;
      color: #1976d2;
    }

    .badge-cerrado {
      background: #e8f5e9;
      color: #388e3c;
    }

    .badge-success {
      background: #e8f5e9;
      color: #388e3c;
    }

    .badge-danger {
      background: #ffebee;
      color: #d32f2f;
    }

    .badge-warning {
      background: #fff3e0;
      color: #f57c00;
    }

    .badge-info {
      background: #e3f2fd;
      color: #1976d2;
    }

    .acciones {
      display: flex;
      gap: 0.5rem;
    }

    .btn-small {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-warning {
      background: #ff9800;
      color: white;
    }

    .btn-warning:hover {
      background: #e68900;
    }

    .btn-info {
      background: #2196f3;
      color: white;
    }

    .btn-info:hover {
      background: #1976d2;
    }

    .descripcion-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .descripcion-cell:hover {
      white-space: normal;
      overflow: visible;
      background: #f0f0f0;
    }

    .observaciones-row {
      background: #f9f9f9 !important;
    }

    .observaciones-content {
      background: #f9f9f9;
      padding: 1rem;
      border-top: 1px solid #eee;
    }

    .obs-form {
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .obs-form textarea {
      flex: 1;
    }

    .obs-list {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }

    .obs-list h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-weight: 600;
    }

    .obs-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .obs-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    /* ✅ NUEVOS ESTILOS PARA USUARIO Y ROL */
    .obs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .obs-fecha {
      margin: 0;
      font-size: 0.85rem;
      color: #999;
      font-weight: 500;
    }

    .obs-usuario {
      margin: 0;
      font-size: 0.9rem;
      color: #555;
      font-weight: 600;
    }

    .obs-rol {
      font-size: 0.75rem;
      background: #667eea;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      margin-left: 0.5rem;
      font-weight: 600;
    }

    .obs-comentario {
      margin: 0;
      color: #333;
      line-height: 1.5;
    }

    .obs-empty {
      text-align: center;
      padding: 1rem;
      color: #999;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .tabla {
        font-size: 0.9rem;
      }

      .tabla th,
      .tabla td {
        padding: 0.75rem;
      }

      .acciones {
        flex-direction: column;
      }

      .btn-small {
        width: 100%;
      }

      .obs-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }
  `]
})
export class ActividadesComponent implements OnInit {
  // Catálogo
  catalogo: Catalogo[] = [];
  tipificaciones: string[] = [];
  actividadesCatalogo: Catalogo[] = [];

  // Actividades
  actividades: Actividad[] = [];
  actividadesFiltradas: Actividad[] = [];

  // Formulario
  formData = {
    proyecto: '',
    tipificacion: '',
    actividadCatalogo: '',
    descripcion: '',
    horas: 0
  };

  // Observación
  observacionForm: { [key: string]: string } = {};

  // Estado
  loading = false;
  loadingActividades = false;
  error = '';
  usuario: any = null;
  showFormulario = false;
  expandedObservaciones: { [key: string]: boolean } = {};

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
    
    this.cargarCatalogo();
    this.cargarActividades();
  }

  cargarCatalogo(): void {
    this.actividadesService.getCatalogo().subscribe({
      next: (data) => {
        this.catalogo = data;
        this.tipificaciones = [...new Set(data.map((c) => c.tipificacion))];
        console.log('Catálogo cargado:', this.catalogo);
      },
      error: (err) => {
        this.error = 'Error al cargar catálogo: ' + (err.error?.message || err.statusText);
        console.error('Error catálogo:', err);
      }
    });
  }

  cargarActividades(): void {
  this.loadingActividades = true;
  this.actividadesService.getActividades().subscribe({
    next: (data) => {
      this.actividades = data;
      
      // ✅ ORDENAR OBSERVACIONES DE MÁS RECIENTE A MÁS ANTIGUA
      this.actividades.forEach(actividad => {
        if (actividad.observaciones && actividad.observaciones.length > 0) {
          actividad.observaciones.sort((a, b) => {
            const fechaA = new Date(a.fecha).getTime();
            const fechaB = new Date(b.fecha).getTime();
            return fechaB - fechaA; // Descendente (más reciente primero)
          });
        }
      });

      console.log('Actividades cargadas:', this.actividades);
      console.log('Usuario actual:', this.usuario);
      
      this.filtrarActividades();
      this.loadingActividades = false;
      
      this.cdr.detectChanges();
      
      console.log('actividadesFiltradas:', this.actividadesFiltradas);
      console.log('loadingActividades:', this.loadingActividades);
    },
    error: (err) => {
      this.error = 'Error al cargar actividades: ' + (err.error?.message || err.statusText);
      this.loadingActividades = false;
      console.error('Error actividades:', err);
    }
  });
}

  filtrarActividades(): void {
    if (this.usuario.rol === 'lider') {
      // ✅ Lider infraestructura solo ve sus propias actividades
      this.actividadesFiltradas = this.actividades.filter(
        (a) => a.lider === this.usuario.nombre
      );
    } else {
      // ✅ Coordinador, Senior, Admin ven TODAS las actividades
      this.actividadesFiltradas = this.actividades;
    }
  }

  cargarActividadesCatalogo(): void {
    if (this.formData.tipificacion) {
      this.actividadesCatalogo = this.catalogo.filter(
        (c) => c.tipificacion === this.formData.tipificacion
      );
    } else {
      this.actividadesCatalogo = [];
    }
    this.formData.actividadCatalogo = '';
  }

  crearActividad(): void {
    if (!this.validarFormulario()) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = '';

    const nuevaActividad = {
      lider: this.usuario.nombre,
      proyecto: this.formData.proyecto,
      tipificacion: this.formData.tipificacion,
      actividadCatalogo: this.formData.actividadCatalogo,
      descripcion: this.formData.descripcion,
      horas: this.formData.horas
    };

    this.actividadesService.crearActividad(nuevaActividad).subscribe({
      next: () => {
        this.loading = false;
        this.resetFormulario();
        this.showFormulario = false;
        this.cargarActividades();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al crear actividad: ' + (err.error?.message || err.statusText);
        console.error('Error crear:', err);
      }
    });
  }

  cerrarActividad(actividadId: string | undefined): void {
    if (!actividadId) return;

    // ✅ Buscar la actividad
    const actividad = this.actividades.find(a => a._id === actividadId);
    if (!actividad) return;

    // ✅ Verificar si hay observación del día de hoy
    const hoy = new Date();
    const hoyString = hoy.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

    const tieneObservacionHoy = actividad.observaciones?.some(obs => {
      const fechaObs = new Date(obs.fecha).toISOString().split('T')[0];
      return fechaObs === hoyString;
    });

    if (!tieneObservacionHoy) {
      this.error = 'No se puede cerrar la actividad sin una observación del día de hoy';
      return;
    }

    if (confirm('¿Está seguro de cerrar esta actividad?')) {
      this.actividadesService.cerrarActividad(actividadId).subscribe({
        next: (actividadActualizada) => {
          // ✅ Actualizar en AMBOS arrays
          const indexMain = this.actividades.findIndex(a => a._id === actividadId);
          if (indexMain !== -1) {
            this.actividades[indexMain] = actividadActualizada;
          }
          
          const indexFiltered = this.actividadesFiltradas.findIndex(a => a._id === actividadId);
          if (indexFiltered !== -1) {
            this.actividadesFiltradas[indexFiltered] = actividadActualizada;
          }
          
          this.cdr.detectChanges();
          console.log('✅ Actividad cerrada:', actividadId);
        },
        error: (err) => {
          this.error = 'Error al cerrar actividad: ' + (err.error?.message || err.statusText);
          console.error('Error cerrar:', err);
        }
      });
    }
  }

guardarObservacion(actividadId: string | undefined): void {
  if (!actividadId || !this.observacionForm[actividadId]?.trim()) {
    this.error = 'El comentario no puede estar vacío';
    return;
  }

  this.actividadesService.agregarObservacion(actividadId, this.observacionForm[actividadId]).subscribe({
    next: (actividadActualizada) => {
      console.log('📥 [OBS] Actividad actualizada desde servidor:', actividadActualizada);
      console.log('📥 [OBS] Observaciones:', actividadActualizada.observaciones);
      console.log('📥 [OBS] Última observación:', actividadActualizada.observaciones?.[actividadActualizada.observaciones.length - 1]);
      
      // ✅ ORDENAR OBSERVACIONES DE MÁS RECIENTE A MÁS ANTIGUA
      if (actividadActualizada.observaciones && actividadActualizada.observaciones.length > 0) {
        actividadActualizada.observaciones.sort((a, b) => {
          const fechaA = new Date(a.fecha).getTime();
          const fechaB = new Date(b.fecha).getTime();
          return fechaB - fechaA; // Descendente (más reciente primero)
        });
      }
      
      // ✅ Actualizar en AMBOS arrays
      const indexMain = this.actividades.findIndex(a => a._id === actividadId);
      if (indexMain !== -1) {
        this.actividades[indexMain] = actividadActualizada;
      }
      
      const indexFiltered = this.actividadesFiltradas.findIndex(a => a._id === actividadId);
      if (indexFiltered !== -1) {
        this.actividadesFiltradas[indexFiltered] = actividadActualizada;
      }
      
      this.observacionForm[actividadId] = '';
      this.cdr.detectChanges();
      
      console.log('✅ Observación agregada a:', actividadId);
      console.log('📅 fechaModificacion actualizada:', actividadActualizada.fechaModificacion);
    },
    error: (err) => {
      this.error = 'Error al agregar observación: ' + (err.error?.message || err.statusText);
      console.error('Error obs:', err);
    }
  });
}

  calcularRiesgo(actividad: Actividad): string {
    if (actividad.estado === 'cerrado') {
      return 'success';
    }

    const dias = this.diasRestantes(actividad);

    if (dias < 0) {
      return 'danger';
    }

    if (dias <= 2) {
      return 'warning';
    }

    return 'info';
  }

  diasRestantes(actividad: Actividad): number {
    const hoy = new Date();
    const cierre = new Date(actividad.fechaCierre!);
    const diff = cierre.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getRiesgoTexto(actividad: Actividad): string {
    if (actividad.estado === 'cerrado') {
      return 'Cerrado';
    }

    const dias = this.diasRestantes(actividad);

    if (dias < 0) {
      return `Vencido hace ${Math.abs(dias)} días`;
    }

    if (dias === 0) {
      return 'Hoy vence';
    }

    return `${dias} días restantes`;
  }

  conteoEstado(estado: string): number {
    return this.actividadesFiltradas.filter((a) => a.estado === estado).length;
  }

  conteoVencidas(): number {
    return this.actividadesFiltradas.filter(
      (a) => a.estado === 'en progreso' && this.diasRestantes(a) < 0
    ).length;
  }

  validarFormulario(): boolean {
    return !!(
      this.formData.proyecto.trim() &&
      this.formData.tipificacion &&
      this.formData.actividadCatalogo &&
      this.formData.descripcion.trim() &&
      this.formData.horas > 0
    );
  }

  resetFormulario(): void {
    this.formData = {
      proyecto: '',
      tipificacion: '',
      actividadCatalogo: '',
      descripcion: '',
      horas: 0
    };
  }

  toggleFormulario(): void {
    this.showFormulario = !this.showFormulario;
    if (!this.showFormulario) {
      this.resetFormulario();
      this.error = '';
    }
  }

  toggleObservaciones(actividadId: string): void {
    console.log('🔍 [OBS] Click en observaciones, ID:', actividadId);
    console.log('🔍 [OBS] Estado anterior:', this.expandedObservaciones[actividadId]);
    
    this.expandedObservaciones[actividadId] = !this.expandedObservaciones[actividadId];
    
    console.log('🔍 [OBS] Estado nuevo:', this.expandedObservaciones[actividadId]);
    
    // ✅ Fuerza detección de cambios
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}