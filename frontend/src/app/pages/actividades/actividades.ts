import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActividadesService, Catalogo, Actividad } from '../../services/actividades.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './actividades.html',
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

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #CC0000;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #AA0000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(204, 0, 0, 0.2);
    }

    .formulario-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #CC0000;
    }

    .formulario-card h3 {
      color: #CC0000;
      margin-top: 0;
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
      color: #333;
      font-size: 0.95rem;
    }

    input,
    select,
    textarea {
      padding: 0.75rem;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #CC0000;
      box-shadow: 0 0 0 3px rgba(204, 0, 0, 0.1);
    }

    .btn-success {
      padding: 0.75rem 1.5rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.3s;
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-2px);
    }

    .btn-success:disabled {
      background: #CCCCCC;
      cursor: not-allowed;
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

    .tabla-wrapper {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      overflow-x: auto;
    }

    .tabla {
      width: 100%;
      border-collapse: collapse;
    }

    .tabla thead {
      background: #333333;
      border-bottom: 2px solid #CC0000;
    }

    .tabla th {
      padding: 1rem;
      text-align: left;
      font-weight: 700;
      color: white;
      font-size: 0.9rem;
    }

    .tabla td {
      padding: 1rem;
      border-bottom: 1px solid #EEEEEE;
    }

    .tabla tbody tr:hover {
      background: #FAFAFA;
    }

    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-en\ progreso {
      background: #E3F2FD;
      color: #0051BA;
    }

    .badge-cerrado {
      background: #E8F5E9;
      color: #2E7D32;
    }

    .badge-success {
      background: #E8F5E9;
      color: #2E7D32;
    }

    .badge-danger {
      background: #FFEBEE;
      color: #CC0000;
    }

    .badge-warning {
      background: #FFF3E0;
      color: #F57C00;
    }

    .badge-info {
      background: #E3F2FD;
      color: #0051BA;
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
    }

    .btn-warning {
      background: #FF9800;
      color: white;
    }

    .btn-warning:hover {
      background: #E68900;
    }

    .btn-info {
      background: #2196F3;
      color: white;
    }

    .btn-info:hover {
      background: #1976D2;
    }

    .observaciones-row {
      background: #F9F9F9 !important;
    }

    .observaciones-content {
      background: #F9F9F9;
      padding: 1.5rem;
    }

    .obs-form-container {
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #CC0000;
    }

    .obs-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .obs-textarea {
      width: 100% !important;
      padding: 1rem !important;
      border: 2px solid #E0E0E0 !important;
      border-radius: 6px !important;
      font-size: 1rem !important;
      font-family: inherit !important;
      resize: vertical;
      min-height: 120px;
    }

    .obs-textarea:focus {
      outline: none !important;
      border-color: #CC0000 !important;
      box-shadow: 0 0 0 3px rgba(204, 0, 0, 0.1) !important;
    }

    .obs-form-actions {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .obs-horas-input {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 0 0 auto;
    }

    .obs-horas-input label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #555;
      margin: 0;
    }

    .obs-horas-input input {
      width: 140px !important;
      padding: 0.75rem !important;
      border: 2px solid #E0E0E0 !important;
      border-radius: 6px !important;
    }

    .obs-horas-input input:focus {
      outline: none !important;
      border-color: #CC0000 !important;
      box-shadow: 0 0 0 3px rgba(204, 0, 0, 0.1) !important;
    }

    .obs-form-actions .btn-success {
      padding: 0.75rem 2rem;
      flex-shrink: 0;
      margin-top: 1.75rem;
    }

    .obs-list {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #CC0000;
      margin-bottom: 1rem;
    }

    .obs-list h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
      font-weight: 700;
    }

    .obs-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #EEEEEE;
    }

    .obs-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .obs-usuario {
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
      color: #333;
      font-weight: 700;
    }

    .obs-fecha {
      margin: 0 0 0.75rem 0;
      font-size: 0.85rem;
      color: #999;
    }

    .obs-comentario {
      margin: 0 0 0.75rem 0;
      color: #555;
      line-height: 1.6;
    }

    .obs-horas {
      margin: 0.75rem 0 0 0;
      font-size: 0.9rem;
      color: #CC0000;
      font-weight: 600;
    }

    .obs-empty {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      color: #999;
      text-align: center;
      border: 1px dashed #E0E0E0;
    }

    .filtros-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #CC0000;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #F0F0F0;
      color: #333;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #E8E8E8;
      border-color: #CC0000;
      color: #CC0000;
    }
  `]
})
export class ActividadesComponent implements OnInit {
  catalogo: Catalogo[] = [];
  tipificaciones: string[] = [];
  actividadesCatalogo: Catalogo[] = [];

  actividades: Actividad[] = [];
  actividadesFiltradas: Actividad[] = [];

  vistaActual: 'mis' | 'grupo' | 'total' | 'seguimiento' = 'mis';
  fechaSeguimientoInicio: Date = new Date();

  filtroLiderSeguimiento: string = '';
  filtroProyectoSeguimiento: string = '';
  lideresDisponibles: string[] = [];
  proyectosDisponibles: string[] = [];

  formData = {
    proyecto: '',
    tipificacion: '',
    actividadCatalogo: '',
    descripcion: '',
    horas: 0
  };

  observacionForm: { [key: string]: string } = {};
  horasForm: { [key: string]: number } = {};

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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.data.subscribe((data) => {
      if (data['vista']) {
        this.vistaActual = data['vista'];
        if (this.vistaActual === 'seguimiento') {
          const hoy = new Date();
          this.fechaSeguimientoInicio = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
      }
    });
    
    this.cargarCatalogo();
    this.cargarActividades();
  }

  cargarCatalogo(): void {
    this.actividadesService.getCatalogo().subscribe({
      next: (data) => {
        this.catalogo = data;
        this.tipificaciones = [...new Set(data.map((c) => c.tipificacion))];
      },
      error: (err) => {
        this.error = 'Error al cargar catálogo: ' + (err.error?.message || err.statusText);
      }
    });
  }

  cargarActividades(): void {
    this.loadingActividades = true;
    this.actividadesService.getActividades().subscribe({
      next: (data) => {
        this.actividades = data;
        this.actividades.forEach(actividad => {
          if (actividad.observaciones && actividad.observaciones.length > 0) {
            actividad.observaciones.sort((a: any, b: any) => {
              const fechaA = new Date(a.fecha).getTime();
              const fechaB = new Date(b.fecha).getTime();
              return fechaB - fechaA;
            });
          }
          this.calcularHorasMes(actividad);
        });
        
        this.cargarFiltrosSeguimiento();
        this.filtrarActividades();
        this.loadingActividades = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar actividades: ' + (err.error?.message || err.statusText);
        this.loadingActividades = false;
      }
    });
  }

  calcularHorasMes(actividad: Actividad): void {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    let horasMesTemp = 0;

    if (actividad.observaciones && actividad.observaciones.length > 0) {
      actividad.observaciones.forEach((obs: any) => {
        const fechaObs = new Date(obs.fecha);
        const mesObs = fechaObs.getMonth();
        const anioObs = fechaObs.getFullYear();
        
        const horasEnObs = obs.horas || 0;
        
        if (mesObs === mesActual && anioObs === anioActual && horasEnObs > 0) {
          horasMesTemp += horasEnObs;
        }
      });
    }

    actividad.horasMes = horasMesTemp;

    if (actividad.estado === 'en progreso') {
      const ultimoDiaDelMes = new Date(anioActual, mesActual + 1, 0).getDate();
      if (hoy.getDate() === ultimoDiaDelMes) {
        actividad.horasAcumuladas = (actividad.horasAcumuladas || 0) + horasMesTemp;
        actividad.horasMes = 0;
      }
    }
  }

  cargarFiltrosSeguimiento(): void {
    const lideresSet = new Set<string>();
    const proyectosSet = new Set<string>();
    
    this.actividades.forEach(actividad => {
      lideresSet.add(actividad.lider);
      proyectosSet.add(actividad.proyecto);
    });
    
    this.lideresDisponibles = Array.from(lideresSet).sort();
    this.proyectosDisponibles = Array.from(proyectosSet).sort();
  }

  filtrarActividades(): void {
    switch (this.vistaActual) {
      case 'mis':
        this.actividadesFiltradas = this.actividades.filter(
          (a) => a.lider === this.usuario.nombre
        );
        break;
      case 'grupo':
        const grupoUsuario = this.usuario.grupo;
        this.actividadesFiltradas = this.actividades.filter((actividad) => {
          const perteneceAlGrupo = actividad.grupoLider === grupoUsuario;
          const esDelUsuario = actividad.lider === this.usuario.nombre;
          return perteneceAlGrupo || esDelUsuario;
        });
        break;
      case 'total':
        let filtradoTotal = this.actividades;
        if (this.filtroLiderSeguimiento) {
          filtradoTotal = filtradoTotal.filter(a => a.lider === this.filtroLiderSeguimiento);
        }
        if (this.filtroProyectoSeguimiento) {
          filtradoTotal = filtradoTotal.filter(a => a.proyecto === this.filtroProyectoSeguimiento);
        }
        this.actividadesFiltradas = filtradoTotal;
        break;
      case 'seguimiento':
        let filtrado = this.actividades.filter((actividad) => {
          if (actividad.estado !== 'en progreso' && actividad.estado !== 'cerrado') {
            return false;
          }
          if (actividad.fechaCreacion) {
            const fechaCreacion = new Date(actividad.fechaCreacion);
            return fechaCreacion >= this.fechaSeguimientoInicio;
          }
          return false;
        });
        
        if (this.filtroLiderSeguimiento) {
          filtrado = filtrado.filter(a => a.lider === this.filtroLiderSeguimiento);
        }
        if (this.filtroProyectoSeguimiento) {
          filtrado = filtrado.filter(a => a.proyecto === this.filtroProyectoSeguimiento);
        }
        
        this.actividadesFiltradas = filtrado;
        this.actividadesFiltradas.sort((a, b) => {
          const fechaA = new Date(a.fechaCreacion).getTime();
          const fechaB = new Date(b.fechaCreacion).getTime();
          return fechaB - fechaA;
        });
        break;
      default:
        this.actividadesFiltradas = [];
    }
  }

  aplicarFiltrosSeguimiento(): void {
    this.filtrarActividades();
  }

  limpiarFiltrosSeguimiento(): void {
    this.filtroLiderSeguimiento = '';
    this.filtroProyectoSeguimiento = '';
    this.filtrarActividades();
  }

  cambiarVista(vista: 'mis' | 'grupo' | 'total' | 'seguimiento'): void {
    if (vista === 'mis') {
      this.router.navigate(['/actividades']);
    } else if (vista === 'grupo') {
      this.router.navigate(['/actividades/grupo']);
    } else if (vista === 'total') {
      this.router.navigate(['/actividades/total']);
    } else if (vista === 'seguimiento') {
      this.router.navigate(['/actividades/seguimiento']);
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
      }
    });
  }

  cerrarActividad(actividadId: string | undefined): void {
    if (!actividadId) return;

    const actividad = this.actividades.find(a => a._id === actividadId);
    if (!actividad) return;

    const hoy = new Date();
    const hoyString = hoy.toISOString().split('T')[0];

    const tieneObservacionHoy = actividad.observaciones?.some((obs: any) => {
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
          const indexMain = this.actividades.findIndex(a => a._id === actividadId);
          if (indexMain !== -1) {
            this.actividades[indexMain] = actividadActualizada;
          }
          const indexFiltered = this.actividadesFiltradas.findIndex(a => a._id === actividadId);
          if (indexFiltered !== -1) {
            this.actividadesFiltradas[indexFiltered] = actividadActualizada;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error al cerrar actividad: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  guardarObservacion(actividadId: string | undefined): void {
    if (!actividadId || !this.observacionForm[actividadId]?.trim()) {
      this.error = 'El comentario no puede estar vacío';
      return;
    }

    this.loading = true;
    this.error = '';

    const horas = this.horasForm[actividadId] || 0;

    this.actividadesService.agregarObservacion(actividadId, this.observacionForm[actividadId], horas).subscribe({
      next: (actividadActualizada) => {
        if (actividadActualizada.observaciones && actividadActualizada.observaciones.length > 0) {
          actividadActualizada.observaciones.sort((a: any, b: any) => {
            const fechaA = new Date(a.fecha).getTime();
            const fechaB = new Date(b.fecha).getTime();
            return fechaB - fechaA;
          });
        }
        
        this.calcularHorasMes(actividadActualizada);
        
        const indexMain = this.actividades.findIndex(a => a._id === actividadId);
        if (indexMain !== -1) {
          this.actividades[indexMain] = actividadActualizada;
        }
        const indexFiltered = this.actividadesFiltradas.findIndex(a => a._id === actividadId);
        if (indexFiltered !== -1) {
          this.actividadesFiltradas[indexFiltered] = actividadActualizada;
        }
        this.observacionForm[actividadId] = '';
        this.horasForm[actividadId] = 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al agregar observación: ' + (err.error?.message || err.statusText);
      }
    });
  }

  calcularRiesgo(actividad: Actividad): string {
    if (actividad.estado === 'cerrado') {
      return 'success';
    }
    const diasHabiles = this.diasHabilesRestantes(actividad);
    if (diasHabiles < 0) {
      return 'danger';
    }
    if (diasHabiles <= 2) {
      return 'warning';
    }
    return 'info';
  }

  diasHabilesRestantes(actividad: Actividad): number {
    if (!actividad.fechaCierre) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const cierre = new Date(actividad.fechaCierre);
    cierre.setHours(0, 0, 0, 0);
    let diasHabiles = 0;
    let fechaActual = new Date(hoy);
    while (fechaActual < cierre) {
      fechaActual.setDate(fechaActual.getDate() + 1);
      const dia = fechaActual.getDay();
      if (dia !== 0 && dia !== 6) {
        diasHabiles++;
      }
    }
    if (hoy < cierre) {
      return diasHabiles;
    }
    return -Math.abs(diasHabiles);
  }

  getRiesgoTexto(actividad: Actividad): string {
    if (actividad.estado === 'cerrado') {
      return '✅ Cerrado';
    }
    const diasHabiles = this.diasHabilesRestantes(actividad);
    if (diasHabiles < 0) {
      return `❌ Vencido hace ${Math.abs(diasHabiles)} días hábiles`;
    }
    if (diasHabiles === 0) {
      return '⚠️ Hoy vence';
    }
    if (diasHabiles === 1) {
      return `⚠️ ${diasHabiles} día hábil restante`;
    }
    return `📅 ${diasHabiles} días hábiles restantes`;
  }

  conteoEstado(estado: string): number {
    return this.actividadesFiltradas.filter((a) => a.estado === estado).length;
  }

  conteoVencidas(): number {
    return this.actividadesFiltradas.filter(
      (a) => a.estado === 'en progreso' && this.diasHabilesRestantes(a) < 0
    ).length;
  }

  puedeVerSeguimiento(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador';
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
    this.expandedObservaciones[actividadId] = !this.expandedObservaciones[actividadId];
    this.cdr.detectChanges();
  }
}