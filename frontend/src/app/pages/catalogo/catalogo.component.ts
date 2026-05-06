import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
<<<<<<< HEAD
import { CatalogoService, CatalogoItem, HistoricoItem } from '../../services/catalogo.service';
import { ChangeDetectorRef } from '@angular/core';

=======
import { CatalogoService, CatalogoItem } from '../../services/catalogo.service';
import { ChangeDetectorRef } from '@angular/core';

interface HistoricoItem extends CatalogoItem {
  estadoHistorico?: 'aprobado' | 'rechazado';
  esHistorico?: boolean;
}

>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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

<<<<<<< HEAD
    .btn-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .btn-success {
      padding: 0.75rem 1.5rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
<<<<<<< HEAD
      font-weight: 600;
      cursor: pointer;
=======
      cursor: pointer;
      font-weight: 600;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
      background: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #e8e8e8;
      border-color: #999;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #667eea;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #eee;
    }

    .tab {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      color: #999;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab:hover {
      color: #667eea;
=======
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
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
      transition: all 0.3s;
=======
      transition: background 0.3s;
    }

    .btn-warning {
      background: #ff9800;
      color: white;
    }

    .btn-warning:hover {
      background: #e68900;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    }

    .btn-info {
      background: #2196f3;
      color: white;
    }

    .btn-info:hover {
      background: #1976d2;
    }

<<<<<<< HEAD
    .btn-success-small {
      background: #4caf50;
      color: white;
    }

    .btn-success-small:hover {
      background: #45a049;
    }

    .btn-danger {
      background: #f44336;
=======
    .btn-danger {
      background: #d32f2f;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      color: white;
    }

    .btn-danger:hover {
<<<<<<< HEAD
      background: #da190b;
=======
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
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    }

    .filter-section {
      background: white;
<<<<<<< HEAD
      padding: 1.5rem;
=======
      padding: 1rem;
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

<<<<<<< HEAD
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-label {
      color: #999;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
    }

    .stat-number {
      color: #667eea;
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
    }

=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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

<<<<<<< HEAD
=======
  // Filtros para histórico
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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

<<<<<<< HEAD
    console.log('📖 Iniciando carga de catálogo...');
    console.log('  Usuario:', this.usuario.nombre);
    console.log('  Rol:', rol);
    console.log('  esAutorizado:', esAutorizado);

    this.catalogoService.getCatalogo(esAutorizado).subscribe({
      next: (data) => {
        console.log('📖 Datos recibidos del servidor:', data.length, 'items');
        console.log('📖 Datos completos:', data);
        
        this.catalogo = this.ordenarCatalogo(data);
        
        console.log('📖 Catálogo después de ordenar:', this.catalogo.length, 'items');
        console.log('📖 Estados presentes:', [...new Set(this.catalogo.map(c => c.estado))]);
        console.log('📖 Catálogo ordenado:', this.catalogo);
        
        this.filtrarCatalogo();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Error al cargar catálogo: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('❌ Error:', err);
=======
    this.catalogoService.getCatalogo(esAutorizado).subscribe({
      next: (data) => {
        this.catalogo = this.ordenarCatalogo(data);
        this.filtrarCatalogo();
        this.loading = false;
        this.cdr.detectChanges();
        console.log('📖 Catálogo cargado:', this.catalogo.length, 'items');
      },
      error: (err) => {
        this.error = 'Error al cargar catálogo: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error:', err);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      }
    });
  }

  cargarHistorico(): void {
    this.loading = true;
    this.error = '';

    console.log('📊 Iniciando carga de histórico...');

    this.catalogoService.getHistorico().subscribe({
      next: (data: any) => {
        console.log('📊 Datos recibidos del servidor:', data.length, 'registros');
        
<<<<<<< HEAD
=======
        // Debug: mostrar estructura de datos
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        if (data.length > 0) {
          console.log('📋 Estructura de primer registro:');
          console.log('   - _id:', data[0]._id);
          console.log('   - actividad:', data[0].actividad);
          console.log('   - estado:', data[0].estado);
          console.log('   - estadoHistorico:', data[0].estadoHistorico);
<<<<<<< HEAD
=======
          console.log('   - esHistorico:', data[0].esHistorico);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        }

        this.historico = data;
        this.cargarSugridoresDisponibles();
        this.aplicarFiltrosHistorico();
        
<<<<<<< HEAD
=======
        // Cargar estadísticas
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        this.catalogoService.getEstadisticasHistorico().subscribe({
          next: (stats) => {
            console.log('📊 Estadísticas recibidas:', stats);
            this.estadisticas = stats;
            this.cdr.detectChanges();
          },
<<<<<<< HEAD
          error: (err: any) => {
=======
          error: (err) => {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
            console.error('Error al cargar estadísticas:', err);
          }
        });

        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Histórico cargado completamente');
      },
<<<<<<< HEAD
      error: (err: any) => {
=======
      error: (err) => {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        this.error = 'Error al cargar histórico: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('❌ Error en getHistorico:', err);
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
<<<<<<< HEAD
    console.log('🔍 Filtrando catálogo...');
    console.log('  activeTab:', this.activeTab);
    console.log('  catalogo.length:', this.catalogo.length);
    console.log('  catalogo:', this.catalogo);

    if (this.activeTab === 'oficial') {
      this.catalogoFiltrado = this.catalogo.filter(item => {
        const match = item.estado === 'oficial';
        console.log(`  - "${item.actividad}" (estado: "${item.estado}") → ${match ? '✅' : '❌'}`);
        return match;
      });
      console.log('  ✅ Catálogo oficial filtrado:', this.catalogoFiltrado.length, 'items');
    } else if (this.activeTab === 'sugerencias') {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'pendiente');
      console.log('  ✅ Sugerencias filtradas:', this.catalogoFiltrado.length, 'items');
    }

    this.cdr.detectChanges();
=======
    if (this.activeTab === 'oficial') {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'oficial');
    } else if (this.activeTab === 'sugerencias') {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'pendiente');
    }
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
    console.log('\n🔍 ========== APLICANDO FILTROS ==========');
    console.log('  Total registros en historico:', this.historico.length);
    console.log('  Estado seleccionado:', this.filtroHistoricoEstado);
    console.log('  Sugeridor seleccionado:', this.filtroHistoricoSugeridor);

    let filtrado = [...this.historico];
    console.log('  Registros iniciales:', filtrado.length);

<<<<<<< HEAD
=======
    // FILTRO 1: Por estado
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    if (this.filtroHistoricoEstado && this.filtroHistoricoEstado !== 'todos') {
      console.log('\n  📊 Aplicando filtro de ESTADO:', this.filtroHistoricoEstado);
      
      const antes = filtrado.length;
      filtrado = filtrado.filter(item => {
        const match = item.estadoHistorico === this.filtroHistoricoEstado;
        if (match) {
          console.log(`    ✅ "${item.actividad}" tiene estadoHistorico="${item.estadoHistorico}"`);
        } else {
          console.log(`    ❌ "${item.actividad}" tiene estadoHistorico="${item.estadoHistorico}" (buscando "${this.filtroHistoricoEstado}")`);
        }
        return match;
      });
      
      console.log(`  Registros después de filtro estado: ${antes} → ${filtrado.length}`);
    }

<<<<<<< HEAD
=======
    // FILTRO 2: Por sugeridor
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    if (this.filtroHistoricoSugeridor && this.filtroHistoricoSugeridor !== '') {
      console.log('\n  👤 Aplicando filtro de SUGERIDOR:', this.filtroHistoricoSugeridor);
      
      const antes = filtrado.length;
      filtrado = filtrado.filter(item => {
        const match = item.sugeridoPor === this.filtroHistoricoSugeridor;
        if (match) {
          console.log(`    ✅ "${item.actividad}" sugerido por "${item.sugeridoPor}"`);
        }
        return match;
      });
      
      console.log(`  Registros después de filtro sugeridor: ${antes} → ${filtrado.length}`);
    }

<<<<<<< HEAD
=======
    // ORDENAR - Con validación de fechas
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    this.historicoFiltrado = filtrado.sort((a, b) => {
      const fechaA = a.fechaSugerencia ? new Date(a.fechaSugerencia).getTime() : 0;
      const fechaB = b.fechaSugerencia ? new Date(b.fechaSugerencia).getTime() : 0;
      return fechaB - fechaA;
    });

    console.log('\n✅ ========== RESULTADO FINAL ==========');
    console.log('  Registros en historicoFiltrado:', this.historicoFiltrado.length);
    console.log('==========================================\n');
  }

  limpiarFiltrosHistorico(): void {
    this.filtroHistoricoEstado = 'todos';
    this.filtroHistoricoSugeridor = '';
    this.aplicarFiltrosHistorico();
  }

  cambiarTab(tab: 'oficial' | 'sugerencias' | 'historico'): void {
    console.log('🔄 Cambiando a pestaña:', tab);
    this.activeTab = tab;
    
    if (tab === 'historico') {
      console.log('📊 Cargando histórico...');
      this.cargarHistorico();
    } else {
      this.filtrarCatalogo();
    }
  }

  guardar(): void {
    if (!this.validarFormulario()) {
<<<<<<< HEAD
      return;
    }

    const actividadNormalizada = this.formData.actividad.toLowerCase().trim();
    const tipificacionSeleccionada = this.formData.tipificacion;

    const existeDuplicado = this.catalogo.some(item => {
      const itemActividadNormalizada = item.actividad.toLowerCase().trim();
      return (
        item.tipificacion === tipificacionSeleccionada &&
        itemActividadNormalizada === actividadNormalizada &&
        item._id !== this.editandoId
      );
    });

    if (existeDuplicado) {
      this.error = `⚠️ Ya existe una actividad llamada "${this.formData.actividad}" en la tipificación "${tipificacionSeleccionada}". Por favor usa un nombre diferente.`;
=======
      this.error = 'Por favor completa todos los campos';
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
      error: (err: any) => {
=======
      error: (err) => {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        this.loading = false;
        this.error = 'Error: ' + (err.error?.message || err.statusText);
        console.error('Error:', err);
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
<<<<<<< HEAD
        error: (err: any) => {
=======
        error: (err) => {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
        error: (err: any) => {
=======
        error: (err) => {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
        error: (err: any) => {
=======
        error: (err) => {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
          this.error = 'Error: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  validarFormulario(): boolean {
<<<<<<< HEAD
    this.error = '';

    if (!this.formData.tipificacion?.trim()) {
      this.error = 'La tipificación es obligatoria';
      return false;
    }

    if (!this.formData.actividad?.trim()) {
      this.error = 'La actividad es obligatoria';
      return false;
    }

    if (!this.formData.diasHabiles || this.formData.diasHabiles <= 0) {
      this.error = '⚠️ Los días hábiles son obligatorios y deben ser mayor a 0';
      return false;
    }

    if (this.formData.horasMinimas === null || 
        this.formData.horasMinimas === undefined || 
        this.formData.horasMinimas < 0) {
      this.error = '⚠️ Las horas mínimas son obligatorias y deben ser >= 0';
      return false;
    }

    if (this.formData.horasMaximas === null || 
        this.formData.horasMaximas === undefined || 
        this.formData.horasMaximas < 0) {
      this.error = '⚠️ Las horas máximas son obligatorias y deben ser >= 0';
      return false;
    }

    if (this.formData.horasMinimas > this.formData.horasMaximas) {
      this.error = '⚠️ Las horas mínimas no pueden ser mayores que las máximas';
      return false;
    }

    return true;
=======
    return !!(
      this.formData.tipificacion.trim() &&
      this.formData.actividad.trim() &&
      this.formData.diasHabiles > 0 &&
      this.formData.horasMinimas >= 0 &&
      this.formData.horasMaximas >= 0 &&
      this.formData.horasMaximas >= this.formData.horasMinimas
    );
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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
<<<<<<< HEAD
    this.error = '';
=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
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