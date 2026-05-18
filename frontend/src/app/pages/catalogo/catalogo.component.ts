import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogoService, CatalogoItem } from '../../services/catalogo.service';
import { ChangeDetectorRef } from '@angular/core';

interface HistoricoItem extends CatalogoItem {
  estadoHistorico?: 'aprobado' | 'rechazado';
  esHistorico?: boolean;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styles: [`
    .catalogo-container {
      min-height: 100vh;
      background: #f5f5f5;
      padding: 1.5rem;
    }

    .page-header {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .page-header h1 {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .import-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      background: #0f766e;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .import-btn input[type='file'] {
      display: none;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid;
    }

    .alert-danger {
      background: #ffebee;
      color: #d32f2f;
      border-left-color: #d32f2f;
    }

    .alert-success {
      background: #e8f5e9;
      color: #388e3c;
      border-left-color: #388e3c;
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
      margin-bottom: 1rem;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .form-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

    .tabla-wrapper {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
      margin-bottom: 1.5rem;
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

    .badge-oficial {
      background: #e8f5e9;
      color: #388e3c;
    }

    .badge-pendiente {
      background: #fff3e0;
      color: #f57c00;
    }

    .badge-aprobado {
      background: #e8f5e9;
      color: #388e3c;
    }

    .badge-rechazado {
      background: #ffebee;
      color: #d32f2f;
    }

    .acciones {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
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

    .btn-danger {
      background: #d32f2f;
      color: white;
    }

    .btn-danger:hover {
      background: #b71c1c;
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

    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #ddd;
      flex-wrap: wrap;
    }

    .tab {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      font-weight: 600;
      cursor: pointer;
      color: #999;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .btn-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      border-top: 3px solid #667eea;
    }

    .stat-label {
      color: #999;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .stat-number {
      color: #667eea;
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0;
    }

    .filter-section {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .catalogo-container {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .acciones {
        flex-direction: column;
      }

      .btn-small {
        width: 100%;
      }

      .tabla {
        font-size: 0.9rem;
      }

      .tabla th,
      .tabla td {
        padding: 0.75rem;
      }

      .tabs {
        gap: 0.5rem;
      }

      .tab {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class CatalogoComponent implements OnInit {
  catalogo: CatalogoItem[] = [];
  catalogoFiltrado: CatalogoItem[] = [];
  historico: HistoricoItem[] = [];
  historicoFiltrado: HistoricoItem[] = [];
  estadisticas: any = null;

  formData = {
    tipificacion: '',
    actividad: '',
    diasHabiles: 1,
    horasMinimas: 0,
    horasMaximas: 0,
    observaciones: ''
  };

  filtroHistoricoEstado: 'todos' | 'aprobado' | 'rechazado' = 'todos';
  filtroHistoricoSugeridor: string = '';
  sugridoresDisponibles: string[] = [];

  editandoId: string | null = null;
  loading = false;
  error = '';
  mensaje = '';
  usuario: any = null;
  activeTab: 'oficial' | 'sugerencias' | 'historico' = 'oficial';

  tipificaciones = ['Administrativo', 'Diseño', 'Documentación', 'Generación Conectividades', 'Gestión', 'Gestión LI FV', 'Implementación Infraestructura', 'Levantamiento Información', 'Pruebas', 'Publicación Servicios', 'Seguridad de la información', 'Soporte', 'Ventana'];

  constructor(
    private catalogoService: CatalogoService,
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
  }

  cargarCatalogo(): void {
    this.loading = true;
    this.error = '';

    const rol = this.usuario.rol?.toLowerCase();
    const esAutorizado = rol === 'coordinador' || rol === 'administrador';

    this.catalogoService.getCatalogo(esAutorizado).subscribe({
      next: (data) => {
        this.catalogo = this.ordenarCatalogo(data);
        this.filtrarCatalogo();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar catálogo: ' + (err.error?.message || err.statusText);
        this.loading = false;
      }
    });
  }

  cargarHistorico(): void {
    this.loading = true;
    this.error = '';

    this.catalogoService.getHistorico().subscribe({
      next: (data: any) => {
        this.historico = data;
        this.cargarSugridoresDisponibles();
        this.aplicarFiltrosHistorico();

        this.catalogoService.getEstadisticasHistorico().subscribe({
          next: (stats) => {
            this.estadisticas = stats;
            this.cdr.detectChanges();
          }
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar histórico: ' + (err.error?.message || err.statusText);
        this.loading = false;
      }
    });
  }

  ordenarCatalogo(data: CatalogoItem[]): CatalogoItem[] {
    return data.sort((a, b) => {
      if (a.tipificacion !== b.tipificacion) {
        return a.tipificacion.localeCompare(b.tipificacion, 'es', { sensitivity: 'base' });
      }
      return a.actividad.localeCompare(b.actividad, 'es', { sensitivity: 'base' });
    });
  }

  filtrarCatalogo(): void {
    if (this.activeTab === 'oficial') {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'oficial');
    } else if (this.activeTab === 'sugerencias') {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'pendiente');
    }
  }

  cargarSugridoresDisponibles(): void {
    const sugridores = new Set<string>();
    this.historico.forEach(item => {
      if (item.sugeridoPor) {
        sugridores.add(item.sugeridoPor);
      }
    });
    this.sugridoresDisponibles = Array.from(sugridores).sort();
  }

  aplicarFiltrosHistorico(): void {
    let filtrado = [...this.historico];

    if (this.filtroHistoricoEstado && this.filtroHistoricoEstado !== 'todos') {
      filtrado = filtrado.filter(item => item.estadoHistorico === this.filtroHistoricoEstado);
    }

    if (this.filtroHistoricoSugeridor && this.filtroHistoricoSugeridor !== '') {
      filtrado = filtrado.filter(item => item.sugeridoPor === this.filtroHistoricoSugeridor);
    }

    this.historicoFiltrado = filtrado.sort((a, b) => {
      const fechaA = a.fechaSugerencia ? new Date(a.fechaSugerencia).getTime() : 0;
      const fechaB = b.fechaSugerencia ? new Date(b.fechaSugerencia).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  limpiarFiltrosHistorico(): void {
    this.filtroHistoricoEstado = 'todos';
    this.filtroHistoricoSugeridor = '';
    this.aplicarFiltrosHistorico();
  }

  cambiarTab(tab: 'oficial' | 'sugerencias' | 'historico'): void {
    this.activeTab = tab;

    if (tab === 'historico') {
      this.cargarHistorico();
    } else {
      this.filtrarCatalogo();
    }
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    const llamada = this.editandoId
      ? this.catalogoService.actualizarCatalogo(this.editandoId, this.formData)
      : this.catalogoService.crearCatalogo(this.formData);

    llamada.subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = this.editandoId
          ? '✅ Catálogo actualizado correctamente'
          : '✅ Catálogo agregado correctamente';

        this.resetFormulario();
        this.cargarCatalogo();

        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error: ' + (err.error?.message || err.statusText);
      }
    });
  }

  editar(item: CatalogoItem): void {
    this.editandoId = item._id || null;
    this.formData = {
      tipificacion: item.tipificacion,
      actividad: item.actividad,
      diasHabiles: item.diasHabiles,
      horasMinimas: item.horasMinimas,
      horasMaximas: item.horasMaximas,
      observaciones: item.observaciones || ''
    };
    window.scrollTo(0, 0);
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.resetFormulario();
  }

  aprobar(id: string): void {
    if (confirm('¿Aprobar esta sugerencia?')) {
      this.catalogoService.aprobarCatalogo(id).subscribe({
        next: () => {
          this.mensaje = '✅ Sugerencia aprobada';
          this.cargarCatalogo();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err) => {
          this.error = 'Error: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  rechazar(id: string): void {
    const observaciones = prompt('¿Por qué rechazar esta sugerencia?');

    if (observaciones !== null) {
      this.catalogoService.rechazarCatalogo(id, observaciones).subscribe({
        next: () => {
          this.mensaje = '❌ Sugerencia rechazada';
          this.cargarCatalogo();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err) => {
          this.error = 'Error: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  eliminar(id: string): void {
    if (confirm('¿Eliminar este catálogo?')) {
      this.catalogoService.eliminarCatalogo(id).subscribe({
        next: () => {
          this.mensaje = '✅ Catálogo eliminado';
          this.cargarCatalogo();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err) => {
          this.error = 'Error: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  descargarPlantillaCSV(): void {
    const contenido = [
      'tipificacion,actividad,diasHabiles,horasMinimas,horasMaximas,observaciones',
      'Soporte,Reinicio de servicio,1,0,2,Actividad de ejemplo',
      'Gestión,Actualización de inventario,2,1,4,Actividad de ejemplo'
    ].join('\n');

    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = 'plantilla_catalogo.csv';
    enlace.click();

    window.URL.revokeObjectURL(url);
  }

  importarCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      const contenido = lector.result as string;
      const registros = this.parsearCSV(contenido);

      if (registros.length === 0) {
        this.error = 'No se encontraron registros válidos para importar.';
        input.value = '';
        return;
      }

      this.loading = true;
      this.error = '';

      this.catalogoService.importarCatalogo(registros).subscribe({
        next: (respuesta) => {
          this.loading = false;
          this.mensaje = `✅ Importación completada. Insertados: ${respuesta?.resumen?.insertados || 0}, duplicados en archivo: ${respuesta?.resumen?.duplicadosEnArchivo || 0}, duplicados en BD: ${respuesta?.resumen?.duplicadosEnBD || 0}`;
          this.cargarCatalogo();
          input.value = '';
          setTimeout(() => this.mensaje = '', 5000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al importar: ' + (err.error?.error || err.error?.message || err.statusText);
          input.value = '';
        }
      });
    };

    lector.readAsText(archivo, 'utf-8');
  }

  private parsearCSV(contenido: string): {
    tipificacion: string;
    actividad: string;
    diasHabiles: number;
    horasMinimas: number;
    horasMaximas: number;
    observaciones: string;
  }[] {
    const lineas = contenido
      .split(/\r?\n/)
      .map(linea => linea.trim())
      .filter(linea => linea.length > 0);

    if (lineas.length <= 1) {
      return [];
    }

    const encabezados = lineas[0].split(',').map(valor => valor.trim().toLowerCase());

    const indiceTipificacion = encabezados.indexOf('tipificacion');
    const indiceActividad = encabezados.indexOf('actividad');
    const indiceDiasHabiles = encabezados.indexOf('diashabiles');
    const indiceHorasMinimas = encabezados.indexOf('horasminimas');
    const indiceHorasMaximas = encabezados.indexOf('horasmaximas');
    const indiceObservaciones = encabezados.indexOf('observaciones');

    if (indiceTipificacion === -1 || indiceActividad === -1 || indiceDiasHabiles === -1) {
      this.error = 'El archivo debe contener como mínimo las columnas tipificacion, actividad y diasHabiles.';
      return [];
    }

    const mapaUnicos = new Map<string, {
      tipificacion: string;
      actividad: string;
      diasHabiles: number;
      horasMinimas: number;
      horasMaximas: number;
      observaciones: string;
    }>();

    for (let i = 1; i < lineas.length; i++) {
      const columnas = lineas[i].split(',').map(valor => valor.trim());

      const tipificacion = columnas[indiceTipificacion]?.trim() || '';
      const actividad = columnas[indiceActividad]?.trim() || '';
      const diasHabiles = Number(columnas[indiceDiasHabiles] || 1);
      const horasMinimas = indiceHorasMinimas >= 0 ? Number(columnas[indiceHorasMinimas] || 0) : 0;
      const horasMaximas = indiceHorasMaximas >= 0 ? Number(columnas[indiceHorasMaximas] || 0) : 0;
      const observaciones = indiceObservaciones >= 0 ? (columnas[indiceObservaciones]?.trim() || '') : '';

      if (!tipificacion || !actividad || !diasHabiles || diasHabiles <= 0) {
        continue;
      }

      const clave = `${tipificacion.trim().toLowerCase()}||${actividad.trim().toLowerCase()}`;

      if (!mapaUnicos.has(clave)) {
        mapaUnicos.set(clave, {
          tipificacion,
          actividad,
          diasHabiles,
          horasMinimas: horasMinimas >= 0 ? horasMinimas : 0,
          horasMaximas: horasMaximas >= 0 ? horasMaximas : 0,
          observaciones
        });
      }
    }

    return Array.from(mapaUnicos.values());
  }

  validarFormulario(): boolean {
    return !!(
      this.formData.tipificacion.trim() &&
      this.formData.actividad.trim() &&
      this.formData.diasHabiles > 0 &&
      this.formData.horasMinimas >= 0 &&
      this.formData.horasMaximas >= 0 &&
      this.formData.horasMaximas >= this.formData.horasMinimas
    );
  }

  resetFormulario(): void {
    this.formData = {
      tipificacion: '',
      actividad: '',
      diasHabiles: 1,
      horasMinimas: 0,
      horasMaximas: 0,
      observaciones: ''
    };
    this.editandoId = null;
  }

  esAutorizado(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'coordinador' || rol === 'administrador';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}