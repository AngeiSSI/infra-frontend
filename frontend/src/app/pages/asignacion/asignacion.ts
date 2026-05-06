import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsignacionService, Asignacion } from '../../services/asignacion.service';
import { AuthService } from '../../services/auth.service';
import { ActividadesService } from '../../services/actividades.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './asignacion.html',
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
      border-left-color: #4CAF50;
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

    .btn-primary:disabled {
      background: #CCCCCC;
      cursor: not-allowed;
    }

    .formulario-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #CC0000;
    }

    .formulario-card h3 {
      color: #CC0000;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
      align-self: flex-start;
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-2px);
    }

    .btn-success:disabled {
      background: #CCCCCC;
      cursor: not-allowed;
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
      font-size: 0.85rem;
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

    .badge-activo {
      background: #E8F5E9;
      color: #2E7D32;
    }

    .badge-inactivo {
      background: #F5F5F5;
      color: #666;
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
      transition: all 0.2s;
    }

    .btn-edit {
      background: #2196F3;
      color: white;
    }

    .btn-edit:hover {
      background: #1976D2;
    }

    .btn-delete {
      background: #FF5252;
      color: white;
    }

    .btn-delete:hover {
      background: #FF1744;
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

    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal.show {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #F0F0F0;
      padding-bottom: 1rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #CC0000;
      font-size: 1.5rem;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
    }

    .modal-close:hover {
      color: #333;
    }

    .detalles-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #CC0000;
    }

    .detalles-section h4 {
      color: #CC0000;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .detalles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .detalle-item {
      padding: 0.75rem;
      background: #F5F5F5;
      border-radius: 4px;
    }

    .detalle-label {
      font-size: 0.85rem;
      color: #999;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .detalle-valor {
      color: #333;
      font-weight: 500;
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
export class AsignacionComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  usuarios: any[] = [];
  
  loading = false;
  error = '';
  exito = '';
  usuario: any = null;
  
  showFormulario = false;
  showModalEditar = false;
  editandoId: string | null = null;

  formData = {
    liderAsignado: '',
    proyecto: '',
    idFeature: '',
    tipologia: '',
    porcentajeAsignacion: 0,
    liSenior: '',
    liderTecnico: '',
    scrum: '',
    po: '',
    liderTecnicoFV: '',
    gerente: '',
    flujoValor: '',
    celula: '',
    pep: '',
    fechaAsignacion: new Date().toISOString().split('T')[0],
    fechaFinAsignacion: ''
  };

  constructor(
    private asignacionService: AsignacionService,
    private authService: AuthService,
    private actividadesService: ActividadesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarUsuarios();
    this.cargarAsignaciones();
  }

  cargarUsuarios(): void {
    this.actividadesService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  cargarAsignaciones(): void {
    this.loading = true;
    this.asignacionService.getAsignaciones().subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar asignaciones: ' + (err.error?.message || err.statusText);
        this.loading = false;
      }
    });
  }

  puedoEditar(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'administrador' || rol === 'coordinador' || rol === 'senior';
  }

  toggleFormulario(): void {
    this.showFormulario = !this.showFormulario;
    if (!this.showFormulario) {
      this.resetFormulario();
      this.error = '';
      this.exito = '';
    }
  }

  resetFormulario(): void {
    this.formData = {
      liderAsignado: '',
      proyecto: '',
      idFeature: '',
      tipologia: '',
      porcentajeAsignacion: 0,
      liSenior: '',
      liderTecnico: '',
      scrum: '',
      po: '',
      liderTecnicoFV: '',
      gerente: '',
      flujoValor: '',
      celula: '',
      pep: '',
      fechaAsignacion: new Date().toISOString().split('T')[0],
      fechaFinAsignacion: ''
    };
    this.editandoId = null;
  }

  validarFormulario(): boolean {
    return !!(
      this.formData.liderAsignado.trim() &&
      this.formData.proyecto.trim() &&
      this.formData.idFeature.trim() &&
      this.formData.tipologia.trim() &&
      this.formData.porcentajeAsignacion >= 0 &&
      this.formData.fechaAsignacion
    );
  }

  guardarAsignacion(): void {
    if (!this.validarFormulario()) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    if (this.formData.porcentajeAsignacion < 0 || this.formData.porcentajeAsignacion > 100) {
      this.error = 'El porcentaje de asignación debe estar entre 0 y 100';
      return;
    }

    this.loading = true;
    this.error = '';
    this.exito = '';

    if (this.editandoId) {
      this.asignacionService.actualizarAsignacion(this.editandoId, this.formData).subscribe({
        next: () => {
          this.loading = false;
          this.exito = 'Asignación actualizada correctamente';
          this.resetFormulario();
          this.showFormulario = false;
          this.cargarAsignaciones();
          setTimeout(() => this.exito = '', 3000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al actualizar asignación: ' + (err.error?.message || err.statusText);
        }
      });
    } else {
      this.asignacionService.crearAsignacion(this.formData).subscribe({
        next: () => {
          this.loading = false;
          this.exito = 'Asignación creada correctamente';
          this.resetFormulario();
          this.showFormulario = false;
          this.cargarAsignaciones();
          setTimeout(() => this.exito = '', 3000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al crear asignación: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  editarAsignacion(asignacion: Asignacion): void {
    if (!this.puedoEditar()) {
      this.error = 'No tienes permisos para editar asignaciones';
      return;
    }

    this.formData = {
      liderAsignado: asignacion.liderAsignado,
      proyecto: asignacion.proyecto,
      idFeature: asignacion.idFeature,
      tipologia: asignacion.tipologia,
      porcentajeAsignacion: asignacion.porcentajeAsignacion,
      liSenior: asignacion.liSenior || '',
      liderTecnico: asignacion.liderTecnico || '',
      scrum: asignacion.scrum || '',
      po: asignacion.po || '',
      liderTecnicoFV: asignacion.liderTecnicoFV || '',
      gerente: asignacion.gerente || '',
      flujoValor: asignacion.flujoValor || '',
      celula: asignacion.celula || '',
      pep: asignacion.pep || '',
      fechaAsignacion: new Date(asignacion.fechaAsignacion).toISOString().split('T')[0],
      fechaFinAsignacion: asignacion.fechaFinAsignacion ? new Date(asignacion.fechaFinAsignacion).toISOString().split('T')[0] : ''
    };
    this.editandoId = asignacion._id || null;
    this.showFormulario = true;
  }

  eliminarAsignacion(id: string | undefined): void {
    if (!id || !this.puedoEditar()) {
      this.error = 'No tienes permisos para eliminar asignaciones';
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta asignación?')) {
      this.loading = true;
      this.asignacionService.eliminarAsignacion(id).subscribe({
        next: () => {
          this.loading = false;
          this.exito = 'Asignación eliminada correctamente';
          this.cargarAsignaciones();
          setTimeout(() => this.exito = '', 3000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al eliminar asignación: ' + (err.error?.message || err.statusText);
        }
      });
    }
  }

  verDetalles(asignacion: Asignacion): void {
    this.showModalEditar = true;
    this.formData = {
      liderAsignado: asignacion.liderAsignado,
      proyecto: asignacion.proyecto,
      idFeature: asignacion.idFeature,
      tipologia: asignacion.tipologia,
      porcentajeAsignacion: asignacion.porcentajeAsignacion,
      liSenior: asignacion.liSenior || '',
      liderTecnico: asignacion.liderTecnico || '',
      scrum: asignacion.scrum || '',
      po: asignacion.po || '',
      liderTecnicoFV: asignacion.liderTecnicoFV || '',
      gerente: asignacion.gerente || '',
      flujoValor: asignacion.flujoValor || '',
      celula: asignacion.celula || '',
      pep: asignacion.pep || '',
      fechaAsignacion: new Date(asignacion.fechaAsignacion).toISOString().split('T')[0],
      fechaFinAsignacion: asignacion.fechaFinAsignacion ? new Date(asignacion.fechaFinAsignacion).toISOString().split('T')[0] : ''
    };
  }

  cerrarModal(): void {
    this.showModalEditar = false;
    this.resetFormulario();
  }

  prepararEdicion(): void {
    this.cerrarModal();
    this.showFormulario = true;
  }

  obtenerEstadoAsignacion(porcentaje: number): string {
    return porcentaje > 0 ? 'activo' : 'inactivo';
  }
}