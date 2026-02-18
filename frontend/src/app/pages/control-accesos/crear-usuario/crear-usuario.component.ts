import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccesosService } from '../../../services/accesos.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="cerrar()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>➕ Crear Nuevo Usuario</h2>
          <button class="btn-close" (click)="cerrar()">✕</button>
        </div>

        <div class="modal-body">
          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>
          <div *ngIf="mensaje" class="alert alert-success">
            {{ mensaje }}
          </div>

          <form (ngSubmit)="crearUsuario()">
            <div class="form-group">
              <label>Nombre Completo *</label>
              <input 
                type="text" 
                [(ngModel)]="formulario.nombre" 
                name="nombre"
                placeholder="ej: Juan Pérez"
                required
              />
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                [(ngModel)]="formulario.email" 
                name="email"
                placeholder="ej: juan@example.com"
                required
              />
            </div>

            <div class="form-group">
              <label>Contraseña *</label>
              <input 
                type="password" 
                [(ngModel)]="formulario.password" 
                name="password"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div class="form-group">
              <label>Rol *</label>
              <select [(ngModel)]="formulario.rol" name="rol" required>
                <option value="">-- Selecciona un rol --</option>
                <option value="lider">Líder de Infraestructura</option>
                <option value="senior">Líder de Infraestructura Senior</option>
                <option value="coordinador">Coordinador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-success" [disabled]="loading">
                {{ loading ? '⏳ Creando...' : '✅ Crear Usuario' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cerrar()">
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      background: #667eea;
      color: white;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px 8px 0 0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.3rem;
    }

    .btn-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
      border-radius: 4px;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
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
    select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
      text-align: center;
    }

    .btn-success {
      background: #4caf50;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-success:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #999;
      color: white;
    }

    .btn-secondary:hover {
      background: #777;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-success {
      background: #e8f5e9;
      color: #388e3c;
      border-left: 4px solid #388e3c;
    }

    .alert-danger {
      background: #ffebee;
      color: #d32f2f;
      border-left: 4px solid #d32f2f;
    }
  `]
})
export class CrearUsuarioComponent {
  @Output() usuarioCreado = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  loading = false;
  error = '';
  mensaje = '';

  formulario = {
    nombre: '',
    email: '',
    password: '',
    rol: ''
  };

  constructor(private accesosService: AccesosService) {}

  crearUsuario(): void {
    // Validar
    if (!this.formulario.nombre.trim()) {
      this.error = '❌ El nombre es requerido';
      return;
    }
    if (!this.formulario.email.trim()) {
      this.error = '❌ El email es requerido';
      return;
    }
    if (!this.formulario.password || this.formulario.password.length < 6) {
      this.error = '❌ La contraseña debe tener mínimo 6 caracteres';
      return;
    }
    if (!this.formulario.rol) {
      this.error = '❌ Debes seleccionar un rol';
      return;
    }

    this.loading = true;
    this.error = '';

    this.accesosService.crearUsuario(this.formulario).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = '✅ Usuario creado correctamente';
        setTimeout(() => {
          this.usuarioCreado.emit();
          this.cerrar();
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = '❌ Error al crear usuario: ' + (err.error?.message || err.statusText);
        console.error('Error:', err);
      }
    });
  }

  cerrar(): void {
    this.cerrarModal.emit();
  }
}