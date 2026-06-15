import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { MacroTareasService, MacroTarea, MicroTarea } from '../../services/macro-tareas.service';
import { ActividadesService, Catalogo, Usuario } from '../../services/actividades.service';
import { ListasMaestrasService, ListaMaestraItem } from '../../services/listas-maestras.service';
import { SearchableSelectComponent } from '../../components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-macro-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableSelectComponent],
  templateUrl: './macro-tareas.html',
  styles: [`
    .page-wrapper {
      min-height: 100vh;
      background: linear-gradient(180deg, #f7f8fb 0%, #f2f4f8 100%);
      padding: 1.5rem;
    }

    .page-shell {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .hero {
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      border-radius: 18px;
      padding: 2rem;
      box-shadow: 0 18px 45px rgba(0, 102, 204, 0.20);
    }

    .hero h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 800;
    }

    .hero p {
      margin: 0;
      opacity: 0.92;
      font-size: 1rem;
      max-width: 760px;
      line-height: 1.5;
    }

    .alert {
      padding: 1rem 1.1rem;
      border-radius: 12px;
      border-left: 5px solid;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    }

    .alert-danger {
      background: #ffebee;
      color: #b71c1c;
      border-left-color: #d32f2f;
    }

    .alert-success {
      background: #e8f5e9;
      color: #1b5e20;
      border-left-color: #43a047;
    }

    .panel {
      background: white;
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
      border: 1px solid #edf1f5;
      overflow: hidden;
    }

    .panel-header {
      padding: 1.2rem 1.4rem;
      border-bottom: 1px solid #eef1f5;
      background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
    }

    .panel-title {
      margin: 0;
      font-size: 1.15rem;
      color: #0066cc;
      font-weight: 800;
    }

    .panel-subtitle {
      margin: 0.35rem 0 0 0;
      color: #6b7280;
      font-size: 0.92rem;
    }

    .panel-body {
      padding: 1.4rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.92rem;
      color: #374151;
      font-weight: 700;
    }

    .btn-row {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .btn-primary, .btn-secondary, .btn-success {
      border: none;
      border-radius: 12px;
      padding: 0.85rem 1.15rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.22s ease;
      font-size: 0.92rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0066cc, #0052a3);
      color: white;
      box-shadow: 0 10px 24px rgba(0, 102, 204, 0.22);
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #dce3ea;
    }

    .btn-success {
      background: linear-gradient(135deg, #2e7d32, #43a047);
      color: white;
    }

    .tabla {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .tabla thead {
      background: linear-gradient(90deg, #0066cc 0%, #0052a3 100%);
    }

    .tabla th {
      color: white;
      padding: 1rem 0.9rem;
      text-align: left;
      font-weight: 700;
      font-size: 0.83rem;
      text-transform: uppercase;
    }

    .tabla td {
      border-bottom: 1px solid #eef1f5;
      padding: 1rem 0.9rem;
      color: #1f2937;
      font-size: 0.94rem;
    }

    .tabla tbody tr:hover {
      background: #fafbfc;
    }

    .micro-tareas-list {
      background: #f9fafb;
      border-radius: 12px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .micro-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border: 1px solid #e5eaf0;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .micro-info {
      flex: 1;
    }

    .micro-name {
      font-weight: 700;
      color: #111827;
    }

    .micro-dias {
      font-size: 0.85rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .action-btn {
      border: none;
      border-radius: 8px;
      padding: 0.5rem 0.8rem;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.8rem;
      margin-left: 0.5rem;
      background: #ffebee;
      color: #c62828;
      transition: all 0.22s ease;
    }

    .action-btn:hover {
      background: #ef5350;
      color: white;
    }

    .btn-ver {
      border: none;
      border-radius: 8px;
      padding: 0.5rem 0.8rem;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.8rem;
      background: #e3f2fd;
      color: #0066cc;
      transition: all 0.22s ease;
    }

    .btn-ver:hover {
      background: #0066cc;
      color: white;
    }

    .btn-editar {
      border: none;
      border-radius: 8px;
      padding: 0.5rem 0.8rem;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.8rem;
      background: #fff3e0;
      color: #f57c00;
      transition: all 0.22s ease;
    }

    .btn-editar:hover {
      background: #f57c00;
      color: white;
    }

    .badge-dias {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: #e3f2fd;
      color: #0052a3;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }

    .total-dias {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5eaf0;
      font-weight: 800;
      color: #0066cc;
    }

    .badge-creador {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: #fef3c7;
      color: #92400e;
      font-weight: 600;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
  `]
})
export class MacroTareasComponent implements OnInit {
  @ViewChild(SearchableSelectComponent) searchableSelect!: SearchableSelectComponent;

  usuario: any = null;
  loading = false;
  error = '';
  exito = '';

  macroTareas: MacroTarea[] = [];
  catalogo: Catalogo[] = [];
  macroTareasExpandidas: { [key: string]: boolean } = {};

  nuevaMacroTarea: Partial<MacroTarea> = {
    nombre: '',
    descripcion: '',
    microTareas: [],
    estado: 'activa'
  };

  // Para edición
  macroTareaEnEdicion: Partial<MacroTarea> | null = null;
  actividadSeleccionada: any = null;
  totalDiasActual = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private macroTareasService: MacroTareasService,
    private actividadesService: ActividadesService,
    private listasMaestrasService: ListasMaestrasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    console.log('Usuario actual:', this.usuario);

    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.puedeAcceder()) {
      this.router.navigate(['/actividades']);
      return;
    }

    this.cargarDatos();
  }

  puedeAcceder(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  cargarDatos(): void {
    console.log('Cargando catálogo...');
    this.actividadesService.getCatalogo().subscribe({
      next: (catalogo) => {
        console.log('Catálogo obtenido:', catalogo.length, 'items');
        this.catalogo = [...catalogo].sort((a, b) =>
          a.actividad.localeCompare(b.actividad, 'es', { sensitivity: 'base' })
        );
        console.log('Catálogo ordenado:', this.catalogo.length);
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
      }
    });

    this.cargarMacroTareas();
  }

  cargarMacroTareas(): void {
    this.macroTareasService.obtenerMacroTareas().subscribe({
      next: (macroTareasAPI) => {
        console.log('Macro tareas obtenidas de API:', macroTareasAPI.length);

        const macroTareasLocal = this.macroTareasService.leerDelLocal();
        console.log('Macro tareas del localStorage:', macroTareasLocal.length);

        const todasLasMacroTareas = [...macroTareasAPI];

        macroTareasLocal.forEach(local => {
          const yaExiste = todasLasMacroTareas.find(api => api._id === local._id);
          if (!yaExiste) {
            todasLasMacroTareas.push(local);
          }
        });

        console.log('Total de macro tareas:', todasLasMacroTareas.length);

        this.macroTareas = todasLasMacroTareas.filter(mt =>
          mt.liderInfraestructuraNombre && mt.liderInfraestructuraNombre.trim().length > 0
        );

        console.log('Macro tareas válidas:', this.macroTareas.length);
        this.cdr.detectChanges(); // ✅ FUERZA LA DETECCIÓN DE CAMBIOS
      },
      error: (err) => {
        console.error('Error al cargar macro tareas de API:', err);

        const macroTareasLocal = this.macroTareasService.leerDelLocal();

        this.macroTareas = macroTareasLocal.filter(mt =>
          mt.liderInfraestructuraNombre && mt.liderInfraestructuraNombre.trim().length > 0
        );
        
        this.cdr.detectChanges(); // ✅ FUERZA LA DETECCIÓN DE CAMBIOS
      }
    });
  }

  agregarMicroTarea(): void {
    if (!this.actividadSeleccionada) {
      this.error = 'Selecciona una actividad del catálogo.';
      return;
    }

    const microTarea: MicroTarea = {
      _id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `micro_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      actividad: this.actividadSeleccionada.actividad,
      catalogoId: this.actividadSeleccionada._id || '',
      diasHabiles: this.actividadSeleccionada.diasHabiles,
      horasMinimas: this.actividadSeleccionada.horasMinimas,
      horasMaximas: this.actividadSeleccionada.horasMaximas
    };

    if (!this.nuevaMacroTarea.microTareas) {
      this.nuevaMacroTarea.microTareas = [];
    }

    this.nuevaMacroTarea.microTareas.push(microTarea);
    this.actualizarTotalDias();
    this.actividadSeleccionada = null;
    this.error = '';
    this.exito = 'Micro tarea agregada correctamente.';

    if (this.searchableSelect) {
      this.searchableSelect.resetear();
    }

    setTimeout(() => this.exito = '', 2000);
  }

  agregarMicroTareaEdicion(): void {
    if (!this.actividadSeleccionada) {
      this.error = 'Selecciona una actividad del catálogo.';
      return;
    }

    const microTarea: MicroTarea = {
      _id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `micro_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      actividad: this.actividadSeleccionada.actividad,
      catalogoId: this.actividadSeleccionada._id || '',
      diasHabiles: this.actividadSeleccionada.diasHabiles,
      horasMinimas: this.actividadSeleccionada.horasMinimas,
      horasMaximas: this.actividadSeleccionada.horasMaximas
    };

    if (!this.macroTareaEnEdicion?.microTareas) {
      this.macroTareaEnEdicion!.microTareas = [];
    }

    this.macroTareaEnEdicion?.microTareas?.push(microTarea);
    this.actividadSeleccionada = null;
    this.error = '';
    this.exito = 'Micro tarea agregada correctamente.';

    if (this.searchableSelect) {
      this.searchableSelect.resetear();
    }

    setTimeout(() => this.exito = '', 2000);
  }

  eliminarMicroTarea(index: number): void {
    if (this.nuevaMacroTarea.microTareas) {
      this.nuevaMacroTarea.microTareas.splice(index, 1);
      this.actualizarTotalDias();
    }
  }

  eliminarMicroTareaEdicion(index: number): void {
    if (this.macroTareaEnEdicion?.microTareas) {
      this.macroTareaEnEdicion.microTareas.splice(index, 1);
    }
  }

  actualizarTotalDias(): void {
    this.totalDiasActual = this.calcularDiasTotales(
      this.nuevaMacroTarea as MacroTarea
    );
  }

  crearMacroTarea(): void {
    if (!this.nuevaMacroTarea.nombre?.trim()) {
      this.error = 'Ingresa el nombre de la macro tarea.';
      return;
    }

    if (!this.nuevaMacroTarea.microTareas || this.nuevaMacroTarea.microTareas.length === 0) {
      this.error = 'Agrega al menos una micro tarea.';
      return;
    }

    console.log('Usuario completo:', this.usuario);

    const macroTareaPayload: MacroTarea = {
      nombre: this.nuevaMacroTarea.nombre,
      descripcion: this.nuevaMacroTarea.descripcion || '',
      liderInfraestructuraId: this.usuario.nombre,
      liderInfraestructuraNombre: this.usuario.nombre,
      microTareas: this.nuevaMacroTarea.microTareas,
      estado: 'activa'
    };

    console.log('Payload a enviar:', macroTareaPayload);

    this.loading = true;
    this.error = '';

    this.macroTareasService.crearMacroTarea(macroTareaPayload).subscribe({
      next: (creada) => {
        console.log('Macro tarea creada:', creada);
        this.loading = false;
        this.exito = 'Macro tarea creada correctamente.';

        this.macroTareas.push(creada);
        this.resetFormulario();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.cargarMacroTareas();
        }, 500);

        setTimeout(() => this.exito = '', 3000);
      },
      error: (err) => {
        console.error('Error completo:', err);
        this.loading = false;
        this.error = 'Error al crear macro tarea: ' + (err.error?.message || err.statusText || err.message);
      }
    });
  }

  guardarEdicion(): void {
    if (!this.macroTareaEnEdicion?._id) {
      this.error = 'ID inválido';
      return;
    }

    if (!this.macroTareaEnEdicion.nombre?.trim()) {
      this.error = 'Ingresa el nombre de la macro tarea.';
      return;
    }

    if (!this.macroTareaEnEdicion.microTareas || this.macroTareaEnEdicion.microTareas.length === 0) {
      this.error = 'Agrega al menos una micro tarea.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.macroTareasService.actualizarMacroTarea(
      this.macroTareaEnEdicion._id,
      this.macroTareaEnEdicion as MacroTarea
    ).subscribe({
      next: (actualizada) => {
        console.log('Macro tarea actualizada:', actualizada);
        this.loading = false;
        this.exito = 'Macro tarea actualizada correctamente.';
        this.macroTareaEnEdicion = null;
        this.cargarMacroTareas();
        setTimeout(() => this.exito = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.loading = false;
        this.error = 'Error al actualizar macro tarea: ' + (err.error?.message || err.statusText || err.message);
      }
    });
  }

  cancelarEdicion(): void {
    this.macroTareaEnEdicion = null;
    this.error = '';
    this.actividadSeleccionada = null;
  }

  eliminarMacroTarea(id: string | undefined): void {
    if (!id) {
      this.error = 'ID inválido';
      return;
    }

    if (!confirm('¿Deseas eliminar esta macro tarea?')) {
      return;
    }

    console.log('Eliminando macro tarea:', id);

    this.macroTareasService.eliminarMacroTarea(id).subscribe({
      next: () => {
        console.log('Macro tarea eliminada');
        this.exito = 'Macro tarea eliminada correctamente.';
        this.cargarMacroTareas();
        setTimeout(() => this.exito = '', 3000);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.error = 'Error al eliminar macro tarea: ' + (err.error?.message || err.statusText || err.message);
      }
    });
  }

  calcularDiasTotales(macroTarea: MacroTarea): number {
    if (!macroTarea || !macroTarea.microTareas) {
      return 0;
    }
    return this.macroTareasService.calcularDiasTotales(macroTarea);
  }

  esDelUsuarioActual(nombreCreador: string): boolean {
    return nombreCreador === this.usuario.nombre;
  }

  trackByMacroId(index: number, macro: MacroTarea): string {
    return macro._id || index.toString();
  }

  toggleVerMicroTareas(macroId: string): void {
    this.macroTareasExpandidas[macroId] = !this.macroTareasExpandidas[macroId];
  }

  editarMacroTarea(id: string): void {
    if (!id) {
      this.error = 'ID inválido';
      return;
    }
    console.log('Editar macro tarea:', id);
    
    const macroAEditar = this.macroTareas.find(m => m._id === id);
    if (macroAEditar) {
      this.macroTareaEnEdicion = JSON.parse(JSON.stringify(macroAEditar)); // Copia profunda
      this.actividadSeleccionada = null;
    }
  }

  resetFormulario(): void {
    this.nuevaMacroTarea = {
      nombre: '',
      descripcion: '',
      microTareas: [],
      estado: 'activa'
    };
    this.actividadSeleccionada = null;
    this.totalDiasActual = 0;

    if (this.searchableSelect) {
      this.searchableSelect.resetear();
    }
  }
}