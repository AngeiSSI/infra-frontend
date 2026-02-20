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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid #ddd;
      flex-shrink: 0;
    }

    .header h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.8rem;
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
      background: #f5f5f5;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid;
      margin-bottom: 1rem;
    }

    .alert-danger {
      background: #ffebee;
      color: #d32f2f;
      border-left-color: #d32f2f;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .stat-label {
      margin: 0 0 0.5rem 0;
      color: #999;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .stat-number {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .formulario-section {
      margin-bottom: 1.5rem;
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-success:disabled {
      background: #ccc;
      cursor: not-allowed;
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
      background: #f5f5f5;
      border-bottom: 2px solid #ddd;
    }

    .tabla th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .tabla td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .tabla tbody tr:hover {
      background: #fafafa;
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

    .observaciones-row {
      background: #f9f9f9 !important;
    }

    .observaciones-content {
      background: #f9f9f9;
      padding: 1rem;
    }

    .obs-form {
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .obs-form textarea {
      flex: 1;
      min-width: 200px;
    }

    .obs-horas-input {
      display: flex;
      gap: 0.5rem;
    }

    .obs-horas-input input {
      width: 150px;
    }

    .obs-list {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }

    .obs-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .obs-usuario {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #555;
      font-weight: 600;
    }

    .obs-fecha {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      color: #999;
    }

    .obs-comentario {
      margin: 0 0 0.5rem 0;
      color: #333;
      line-height: 1.5;
    }

    .obs-horas {
      margin: 0.5rem 0 0 0;
      font-size: 0.9rem;
      color: #667eea;
    }

    .obs-empty {
      padding: 1rem;
      background: white;
      border-radius: 4px;
      color: #999;
      text-align: center;
    }

    .filtros-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #757575;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #616161;
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

  // Filtros para seguimiento semanal
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

    // Obtener vista de los datos de la ruta
    this.route.data.subscribe((data) => {
      if (data['vista']) {
        this.vistaActual = data['vista'];
        // Si es seguimiento, calcular fecha inicio (hoy - 7 días)
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
          // Calcular horasMes basado en observaciones del mes actual
          this.calcularHorasMes(actividad);
        });
        
        // Cargar opciones de filtro
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
  // Obtener mes y año actual
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  let horasMesTemp = 0;

  console.log(`📊 Calculando horas mes para: ${actividad.actividadCatalogo}`);

  // Sumar horas de observaciones del mes actual
  if (actividad.observaciones && actividad.observaciones.length > 0) {
    actividad.observaciones.forEach((obs: any) => {
      const fechaObs = new Date(obs.fecha);
      const mesObs = fechaObs.getMonth();
      const anioObs = fechaObs.getFullYear();
      
      // FIX: Usar obs.horas si existe, sino intentar obtener del comentario
      const horasEnObs = obs.horas || 0;
      
      console.log(`  📅 Observación: ${obs.fecha}, Horas: ${horasEnObs}, Mes: ${mesObs}, Año: ${anioObs}`);
      
      if (mesObs === mesActual && anioObs === anioActual && horasEnObs > 0) {
        horasMesTemp += horasEnObs;
        console.log(`    ✅ Agregada, Total: ${horasMesTemp}`);
      }
    });
  }

  console.log(`✅ Horas Mes Final: ${horasMesTemp}`);

  // Actualizar horasMes
  actividad.horasMes = horasMesTemp;

  // Si la actividad está en progreso y es el último día del mes, mover horasMes a horasAcumuladas
  if (actividad.estado === 'en progreso') {
    const ultimoDiaDelMes = new Date(anioActual, mesActual + 1, 0).getDate();
    if (hoy.getDate() === ultimoDiaDelMes) {
      console.log(`⚠️ Es el último día del mes, moviendo ${horasMesTemp} a horasAcumuladas`);
      actividad.horasAcumuladas = (actividad.horasAcumuladas || 0) + horasMesTemp;
      actividad.horasMes = 0;
    }
  }
}

  cargarFiltrosSeguimiento(): void {
    // Obtener lista única de líderes y proyectos
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
        console.log('🔍 Grupo del usuario actual:', grupoUsuario);
        
        this.actividadesFiltradas = this.actividades.filter((actividad) => {
          const perteneceMismoGrupo = actividad.grupoLider === grupoUsuario;
          const esDelUsuario = actividad.lider === this.usuario.nombre;
          
          return perteneceMismoGrupo || esDelUsuario;
        });
        break;
      case 'total':
        // Filtrar todas las actividades
        let filtradoTotal = this.actividades;
        
        // Aplicar filtros adicionales
        if (this.filtroLiderSeguimiento) {
          filtradoTotal = filtradoTotal.filter(a => a.lider === this.filtroLiderSeguimiento);
        }
        
        if (this.filtroProyectoSeguimiento) {
          filtradoTotal = filtradoTotal.filter(a => a.proyecto === this.filtroProyectoSeguimiento);
        }
        
        this.actividadesFiltradas = filtradoTotal;
        break;
      case 'seguimiento':
        // Filtrar actividades de la última semana (en progreso y cerradas)
        let filtrado = this.actividades.filter((actividad) => {
          // Solo actividades en progreso o cerradas
          if (actividad.estado !== 'en progreso' && actividad.estado !== 'cerrado') {
            return false;
          }
          
          // Actividades creadas en los últimos 7 días
          if (actividad.fechaCreacion) {
            const fechaCreacion = new Date(actividad.fechaCreacion);
            return fechaCreacion >= this.fechaSeguimientoInicio;
          }
          
          return false;
        });
        
        // Aplicar filtros adicionales
        if (this.filtroLiderSeguimiento) {
          filtrado = filtrado.filter(a => a.lider === this.filtroLiderSeguimiento);
        }
        
        if (this.filtroProyectoSeguimiento) {
          filtrado = filtrado.filter(a => a.proyecto === this.filtroProyectoSeguimiento);
        }
        
        this.actividadesFiltradas = filtrado;
        
        // Ordenar por fecha de creación (más recientes primero)
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

  // Métodos para los filtros
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

    // Obtener horas si las hay
    const horas = this.horasForm[actividadId] || 0;

    console.log(`💾 Guardando observación con ${horas} horas`);

    this.actividadesService.agregarObservacion(actividadId, this.observacionForm[actividadId], horas).subscribe({
      next: (actividadActualizada) => {
        console.log(`✅ Observación guardada:`, actividadActualizada);
        
        if (actividadActualizada.observaciones && actividadActualizada.observaciones.length > 0) {
          actividadActualizada.observaciones.sort((a: any, b: any) => {
            const fechaA = new Date(a.fecha).getTime();
            const fechaB = new Date(b.fecha).getTime();
            return fechaB - fechaA;
          });
        }
        
        // Recalcular horasMes
        this.calcularHorasMes(actividadActualizada);
        console.log(`📊 HorasMes después de calcular: ${actividadActualizada.horasMes}`);
        
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