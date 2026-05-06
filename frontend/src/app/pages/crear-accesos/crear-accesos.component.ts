import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccesosService, Usuario } from '../../services/accesos.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-accesos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-accesos.html',
  styles: [`
    .crear-accesos-container {
      min-height: 100vh;
      background: #f5f5f5;
      padding: 2rem;
    }

    .page-header {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .page-header h1 {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
    }

    .content-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 1000px;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h2 {
      color: #333;
      font-size: 1.3rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 1rem;
      border-bottom: 2px solid #ddd;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
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

    .usuarios-seleccion {
      margin-top: 2rem;
    }

    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .usuario-card {
      background: #f9f9f9;
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .usuario-card:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    .usuario-card.selected {
      background: #e3f2fd;
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }

    .usuario-card input[type="checkbox"] {
      margin-right: 0.5rem;
    }

    .usuario-nombre {
      font-weight: 600;
      color: #333;
      margin: 0.5rem 0 0 0;
    }

    .usuario-email {
      font-size: 0.85rem;
      color: #999;
      margin: 0.25rem 0 0 0;
    }

    .usuario-rol {
      font-size: 0.8rem;
      background: #667eea;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      display: inline-block;
      margin-top: 0.5rem;
      text-transform: capitalize;
    }

    .permisos-section {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .permisos-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .permisos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .permiso-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      text-align: center;
    }

    .permiso-card input[type="checkbox"] {
      display: block;
      margin: 0 auto 0.5rem auto;
      cursor: pointer;
    }

    .permiso-card label {
      margin: 0;
      font-weight: 600;
      color: #333;
      cursor: pointer;
    }

    .btn-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
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

    .alert-info {
      background: #e3f2fd;
      color: #1976d2;
      border-left: 4px solid #1976d2;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #667eea;
      font-weight: 600;
    }

    .no-permiso {
      background: #fff3e0;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      color: #f57c00;
    }
  `]
})
export class CrearAccesosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosSeleccionados: Set<string> = new Set();
  
  loading = false;
  error = '';
  mensaje = '';
  usuario: any = null;
  esCoordinador = false;

  moduloSeleccionado = '';
  permisos = [
    { valor: 'ver', label: 'Ver' },
    { valor: 'crear', label: 'Crear' },
    { valor: 'editar', label: 'Editar' },
    { valor: 'eliminar', label: 'Eliminar' },
    { valor: 'cerrar', label: 'Cerrar' }
  ];

  permisosSeleccionados: Set<string> = new Set();

  modulos = [
    { valor: 'actividades', label: 'Actividades' },
    { valor: 'control-accesos', label: 'Control de Accesos' }
  ];

  constructor(
    private accesosService: AccesosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    const rol = this.usuario?.rol?.toLowerCase();
    
    if (rol !== 'coordinador') {
      this.router.navigate(['/actividades']);
      return;
    }

    this.esCoordinador = true;
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.accesosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.loading = false;
        console.log('✅ Usuarios cargados:', this.usuarios.length);
      },
      error: (err: any) => {
        this.error = '❌ Error al cargar usuarios: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  toggleUsuario(usuarioId: string | undefined): void {
    if (!usuarioId) return;
    if (this.usuariosSeleccionados.has(usuarioId)) {
      this.usuariosSeleccionados.delete(usuarioId);
    } else {
      this.usuariosSeleccionados.add(usuarioId);
    }
  }

  togglePermiso(permiso: string): void {
    if (this.permisosSeleccionados.has(permiso)) {
      this.permisosSeleccionados.delete(permiso);
    } else {
      this.permisosSeleccionados.add(permiso);
    }
  }

  crearAccesos(): void {
    if (this.usuariosSeleccionados.size === 0) {
      this.error = '❌ Debes seleccionar al menos un usuario';
      return;
    }

    if (!this.moduloSeleccionado) {
      this.error = '❌ Debes seleccionar un módulo';
      return;
    }

    if (this.permisosSeleccionados.size === 0) {
      this.error = '❌ Debes seleccionar al menos un permiso';
      return;
    }

    this.loading = true;
    this.error = '';

    const accesosACrear = Array.from(this.usuariosSeleccionados).map(usuarioId => ({
      usuarioId,
      modulo: this.moduloSeleccionado,
      permisos: Array.from(this.permisosSeleccionados)
    }));

    console.log('📤 Creando accesos:', accesosACrear);

    // Crear acceso para cada usuario y cada permiso
    let completados = 0;
    let errores = 0;

    this.usuariosSeleccionados.forEach(usuarioId => {
      const accesos = Array.from(this.permisosSeleccionados).map(permiso => ({
        usuarioId,
        modulo: this.moduloSeleccionado,
        permiso: permiso as 'ver' | 'crear' | 'editar' | 'eliminar' | 'cerrar',
        activo: true
      }));

      this.accesosService.actualizarAccesos(usuarioId, accesos).subscribe({
        next: () => {
          completados++;
          if (completados + errores === this.usuariosSeleccionados.size) {
            this.loading = false;
            if (errores === 0) {
              this.mensaje = `✅ Accesos creados correctamente para ${completados} usuario(s)`;
              this.usuariosSeleccionados.clear();
              this.permisosSeleccionados.clear();
              this.moduloSeleccionado = '';
              setTimeout(() => this.mensaje = '', 3000);
            }
          }
        },
        error: (err: any) => {
          errores++;
          if (completados + errores === this.usuariosSeleccionados.size) {
            this.loading = false;
            this.error = `❌ Error: ${completados} usuarios procesados, ${errores} con error`;
          }
        }
      });
    });
  }

  estaSeleccionado(usuarioId: string | undefined): boolean {
    return usuarioId ? this.usuariosSeleccionados.has(usuarioId) : false;
  }

  tienePermiso(permiso: string): boolean {
    return this.permisosSeleccionados.has(permiso);
  }
}