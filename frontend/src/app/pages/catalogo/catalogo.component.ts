import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogoService, CatalogoItem } from '../../services/catalogo.service';
import { ChangeDetectorRef } from '@angular/core';

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
    }
  `]
})
export class CatalogoComponent implements OnInit {
  catalogo: CatalogoItem[] = [];
  catalogoFiltrado: CatalogoItem[] = [];

  formData = {
    tipificacion: '',
    actividad: '',
    diasHabiles: 1,
    horasMinimas: 0,
    horasMaximas: 0
  };

  editandoId: string | null = null;
  loading = false;
  error = '';
  mensaje = '';
  usuario: any = null;
  activeTab: 'oficial' | 'sugerencias' = 'oficial';

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
        console.log('📖 Catálogo cargado:', this.catalogo.length, 'items');
      },
      error: (err) => {
        this.error = 'Error al cargar catálogo: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  ordenarCatalogo(data: CatalogoItem[]): CatalogoItem[] {
    return data.sort((a, b) => {
      // Primero ordenar por tipificación alfabéticamente
      if (a.tipificacion !== b.tipificacion) {
        return a.tipificacion.localeCompare(b.tipificacion, 'es', { sensitivity: 'base' });
      }
      // Luego ordenar por actividad alfabéticamente dentro de la misma tipificación
      return a.actividad.localeCompare(b.actividad, 'es', { sensitivity: 'base' });
    });
  }

  filtrarCatalogo(): void {
    if (this.activeTab === 'oficial') {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'oficial');
    } else {
      this.catalogoFiltrado = this.catalogo.filter(item => item.estado === 'pendiente');
    }
  }

  cambiarTab(tab: 'oficial' | 'sugerencias'): void {
    this.activeTab = tab;
    this.filtrarCatalogo();
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
      horasMaximas: item.horasMaximas
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
      horasMaximas: 0
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