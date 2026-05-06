import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccesosService, Usuario } from '../../services/accesos.service';
import { AuthService } from '../../services/auth.service';
import { ActividadesService } from '../../services/actividades.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styles: [`
    .gestion-usuarios-container {
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

    .main-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

<<<<<<< HEAD
=======
    /* TABLA */
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .tabla-usuarios {
      width: 100%;
    }

    .tabla-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #ddd;
    }

    .tabla-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.3rem;
    }

    .tabla {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .tabla thead {
      background: #667eea;
      color: white;
    }

    .tabla th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #667eea;
    }

    .tabla td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .tabla tbody tr:hover {
      background: #f9f9f9;
    }

    .tabla tbody tr.inactivo {
      opacity: 0.6;
      background: #f5f5f5;
    }

    .badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-perfil {
      background: #e3f2fd;
      color: #1976d2;
    }

<<<<<<< HEAD
    .badge-super-admin {
      background: #fce4ec;
      color: #c2185b;
      font-weight: 700;
      border: 1px solid #c2185b;
    }

    .badge-administrador {
      background: #f3e5f5;
      color: #7b1fa2;
      font-weight: 700;
    }

=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .badge-activo {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #e8f5e9;
      color: #388e3c;
    }

    .badge-inactivo {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #ffebee;
      color: #d32f2f;
    }

<<<<<<< HEAD
=======
    .btn-editar {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      transition: transform 0.2s;
    }

    .btn-editar:hover {
      transform: scale(1.2);
    }

    /* FORMULARIO */
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .formulario-container {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .formulario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #ddd;
    }

    .formulario-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.3rem;
    }

    .btn-cerrar {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.3s;
    }

    .btn-cerrar:hover {
      color: #333;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
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

<<<<<<< HEAD
    input, select {
=======
    input,
    select {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

<<<<<<< HEAD
    input:focus, select:focus {
=======
    input:focus,
    select:focus {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

<<<<<<< HEAD
    select:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.6;
    }

=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .password-input {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }

    .btn-generar {
      padding: 0.75rem 1rem;
      background: #999;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
      white-space: nowrap;
    }

    .btn-generar:hover {
      background: #777;
    }

<<<<<<< HEAD
=======
    /* CHECKBOX */
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      color: #333;
    }

    .checkbox-input {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin: 0;
      padding: 0;
    }

    .checkbox-help {
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .btn-group {
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

    .btn-danger {
      background: #d32f2f;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #b71c1c;
    }

    .btn-danger:disabled {
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

<<<<<<< HEAD
    .alert-warning {
      background: #fff3e0;
      color: #f57c00;
      border-left: 4px solid #f57c00;
    }

=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    .loading {
      text-align: center;
      padding: 2rem;
      color: #667eea;
      font-weight: 600;
    }

    .password-info {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #1976d2;
      color: #1976d2;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .required {
      color: #d32f2f;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #999;
    }

    .empty-state p {
      margin-bottom: 2rem;
      font-size: 1.1rem;
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

<<<<<<< HEAD
    .btn-editar {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      transition: transform 0.2s;
    }

    .btn-editar:hover {
      transform: scale(1.2);
    }

    .info-box {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      color: #1976d2;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .tabla { font-size: 0.9rem; }
      .tabla th, .tabla td { padding: 0.75rem; }
=======
    @media (max-width: 1024px) {
      .tabla {
        font-size: 0.9rem;
      }

      .tabla th,
      .tabla td {
        padding: 0.75rem;
      }
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
    }
  `]
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  mostrarFormulario = false;
  
  loading = false;
  error = '';
  mensaje = '';
  usuario: any = null;
<<<<<<< HEAD
  yaExisteSuperAdmin = false;
  cantidadAdministradores = 0;
=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

  formulario = {
    nombre: '',
    email: '',
    grupo: '',
    perfil: '',
    password: 'Infra2026!',
    activo: true
  };

<<<<<<< HEAD
  perfiles: any[] = [];
=======
  perfiles = [
    { valor: 'lider', label: 'Líder de Infraestructura' },
    { valor: 'senior', label: 'Líder de Infraestructura Senior' },
    { valor: 'coordinador', label: 'Coordinador' },
    { valor: 'administrador', label: 'Administrador' }
  ];
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

  grupos = [
    { valor: 'Grupo 1', label: 'Grupo 1 Corporativo' },
    { valor: 'Grupo 2', label: 'Grupo 2 Corporativo' },
    { valor: 'Grupo 3', label: 'Grupo 3 Corporativo' },
    { valor: 'Salesforce', label: 'Grupo 4 Salesforce' },
    { valor: 'DMP', label: 'Grupo 5 DMP' },
    { valor: 'Coordinadores', label: 'Coordinadores' }
  ];

  constructor(
    private accesosService: AccesosService,
    private authService: AuthService,
    private actividadesService: ActividadesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
<<<<<<< HEAD
    console.log('👤 Usuario actual:', this.usuario);
    
    const rol = this.usuario?.rol?.toLowerCase();
    console.log('👤 Rol:', rol);
    
    if (rol !== 'coordinador' && rol !== 'administrador' && rol !== 'super_admin') {
      console.log('❌ Acceso denegado');
=======
    console.log('👤 Usuario:', this.usuario);
    
    const rol = this.usuario?.rol?.toLowerCase();
    
    if (rol !== 'coordinador' && rol !== 'administrador') {
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.router.navigate(['/actividades']);
      return;
    }

<<<<<<< HEAD
    console.log('✅ Acceso permitido a Gestión de Usuarios');
    this.establecerPerfiles();
    this.cargarUsuarios();
  }

  establecerPerfiles(): void {
    const rol = this.usuario?.rol?.toLowerCase();
    console.log('🔧 Estableciendo perfiles para rol:', rol);

    if (rol === 'super_admin') {
      this.perfiles = [
        { valor: 'lider', label: 'Líder de Infraestructura' },
        { valor: 'senior', label: 'Líder de Infraestructura Senior' },
        { valor: 'coordinador', label: 'Coordinador' },
        { valor: 'administrador', label: '🔐 Administrador (Máximo 2)' },
        { valor: 'super_admin', label: '👑 Super Admin (Máximo 1)' }
      ];
      console.log('✅ Super Admin - Todos los perfiles disponibles');
    } else if (rol === 'administrador') {
      this.perfiles = [
        { valor: 'lider', label: 'Líder de Infraestructura' },
        { valor: 'senior', label: 'Líder de Infraestructura Senior' },
        { valor: 'coordinador', label: 'Coordinador' },
        { valor: 'administrador', label: '🔐 Administrador (Máximo 2)' },
        { valor: 'super_admin', label: '👑 Super Admin (Máximo 1)' }
      ];
      console.log('✅ Administrador - Todos los perfiles disponibles');
    } else if (rol === 'coordinador') {
      this.perfiles = [
        { valor: 'lider', label: 'Líder de Infraestructura' },
        { valor: 'senior', label: 'Líder de Infraestructura Senior' },
        { valor: 'coordinador', label: 'Coordinador' },
        { valor: 'administrador', label: '🔐 Administrador (Máximo 2)' }
      ];
      console.log('✅ Coordinador - Perfiles básicos + Administrador');
    }
  }

=======
    this.cargarUsuarios();
  }

>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
  cargarUsuarios(): void {
    this.loading = true;
    console.log('🔄 Cargando usuarios...');
    
    this.accesosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        console.log('✅ Usuarios cargados:', data.length);
        this.usuarios = data;
<<<<<<< HEAD

        this.yaExisteSuperAdmin = data.some(u => u.rol?.toLowerCase() === 'super_admin');
        console.log('👑 ¿Ya existe Super Admin?:', this.yaExisteSuperAdmin);

        this.cantidadAdministradores = data.filter(u => u.rol?.toLowerCase() === 'administrador').length;
        console.log('🔐 Cantidad de Administradores:', this.cantidadAdministradores);

=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error al cargar usuarios:', err);
        this.error = '❌ Error al cargar usuarios: ' + (err.error?.message || err.statusText);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirFormulario(): void {
    console.log('📝 Abriendo formulario para nuevo usuario');
    this.mostrarFormulario = true;
    this.usuarioSeleccionado = null;
    this.formulario = {
      nombre: '',
      email: '',
      grupo: '',
      perfil: '',
      password: 'Infra2026!',
      activo: true
    };
    this.error = '';
  }

  cerrarFormulario(): void {
    console.log('❌ Cerrando formulario');
    this.mostrarFormulario = false;
    this.usuarioSeleccionado = null;
    this.error = '';
  }

  editarUsuario(usuario: Usuario): void {
    console.log('✏️ Editando usuario:', usuario);
    this.usuarioSeleccionado = usuario;
    this.formulario = {
      nombre: usuario.nombre,
      email: usuario.email,
      grupo: (usuario as any).grupo || '',
      perfil: usuario.rol,
      password: '',
      activo: usuario.activo || true
    };
    this.mostrarFormulario = true;
    this.error = '';
  }

  guardarUsuario(): void {
    console.log('🔍 Validando formulario...');
<<<<<<< HEAD

    if (!this.formulario.nombre.trim()) {
=======
    console.log('📋 Formulario actual:', this.formulario);
    console.log('✏️ Usuario seleccionado:', this.usuarioSeleccionado);

    if (!this.formulario.nombre.trim()) {
      console.log('❌ Nombre vacío');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.error = '❌ El nombre es requerido';
      return;
    }
    if (!this.formulario.email.trim()) {
<<<<<<< HEAD
=======
      console.log('❌ Email vacío');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.error = '❌ El email es requerido';
      return;
    }
    if (!this.formulario.perfil) {
<<<<<<< HEAD
=======
      console.log('❌ Perfil vacío');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.error = '❌ El perfil es requerido';
      return;
    }
    if (!this.formulario.grupo) {
<<<<<<< HEAD
      this.error = '❌ El grupo es requerido';
      return;
    }

    const rol = this.usuario?.rol?.toLowerCase();
    const perfil = this.formulario.perfil;
    const esEdicion = !!this.usuarioSeleccionado;
    const usuarioEsAdmin = this.usuarioSeleccionado?.rol?.toLowerCase() === 'administrador';
    const usuarioEsSuperAdmin = this.usuarioSeleccionado?.rol?.toLowerCase() === 'super_admin';

    console.log('📊 Debug:', { 
      rol, 
      perfil, 
      esEdicion, 
      usuarioEsAdmin, 
      usuarioEsSuperAdmin, 
      cantidadAdministradores: this.cantidadAdministradores, 
      yaExisteSuperAdmin: this.yaExisteSuperAdmin 
    });

    // VALIDACIÓN: Super Admin
    if (rol === 'super_admin') {
      if (perfil === 'super_admin') {
        if (this.yaExisteSuperAdmin && !esEdicion) {
          this.error = '❌ Ya existe un Super Admin. Solo puede haber 1 en el sistema.';
          return;
        }
        if (esEdicion && !usuarioEsSuperAdmin && this.yaExisteSuperAdmin) {
          this.error = '❌ Ya existe un Super Admin. Solo puede haber 1 en el sistema.';
          return;
        }
      }
      
      if (perfil === 'administrador') {
        if (this.cantidadAdministradores >= 2 && !esEdicion) {
          this.error = '❌ Ya hay 2 Administradores. Solo puede haber máximo 2.';
          return;
        }
        if (esEdicion && !usuarioEsAdmin && this.cantidadAdministradores >= 2) {
          this.error = '❌ Ya hay 2 Administradores. Solo puede haber máximo 2.';
          return;
        }
      }
    }
    // VALIDACIÓN: Administrador
    else if (rol === 'administrador') {
      // Administrador SÍ puede crear Super Admin (máximo 1)
      if (perfil === 'super_admin') {
        if (this.yaExisteSuperAdmin && !esEdicion) {
          this.error = '❌ Ya existe un Super Admin. Solo puede haber 1 en el sistema.';
          return;
        }
        if (esEdicion && !usuarioEsSuperAdmin && this.yaExisteSuperAdmin) {
          this.error = '❌ Ya existe un Super Admin. Solo puede haber 1 en el sistema.';
          return;
        }
      }
      
      if (perfil === 'administrador') {
        if (this.cantidadAdministradores >= 2 && !esEdicion) {
          this.error = '❌ Ya hay 2 Administradores. Solo puede haber máximo 2.';
          return;
        }
        if (esEdicion && !usuarioEsAdmin && this.cantidadAdministradores >= 2) {
          this.error = '❌ Ya hay 2 Administradores. Solo puede haber máximo 2.';
          return;
        }
      }
    }
    // VALIDACIÓN: Coordinador
    else if (rol === 'coordinador') {
      // Coordinador NO puede crear Super Admin
      if (perfil === 'super_admin') {
        this.error = '❌ No tienes permisos para crear Super Admin';
        return;
      }
      
      if (perfil === 'administrador') {
        if (this.cantidadAdministradores >= 2 && !esEdicion) {
          this.error = '❌ Ya hay 2 Administradores. Solo puede haber máximo 2.';
          return;
        }
        if (esEdicion && !usuarioEsAdmin && this.cantidadAdministradores >= 2) {
          this.error = '❌ Ya hay 2 Administradores. Solo puede haber máximo 2.';
          return;
        }
      }
    }

    if (!this.usuarioSeleccionado && (!this.formulario.password || this.formulario.password.length < 6)) {
=======
      console.log('❌ Grupo vacío');
      this.error = '❌ El grupo es requerido';
      return;
    }
    if (!this.usuarioSeleccionado && (!this.formulario.password || this.formulario.password.length < 6)) {
      console.log('❌ Contraseña vacía o muy corta');
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.error = '❌ La contraseña debe tener mínimo 6 caracteres';
      return;
    }

    console.log('✅ Validaciones pasadas, procediendo a guardar...');
    this.loading = true;
    this.error = '';

    if (this.usuarioSeleccionado) {
      console.log('📝 Modo: ACTUALIZAR');
      const usuarioActualizado = {
        nombre: this.formulario.nombre,
        email: this.formulario.email,
        rol: this.formulario.perfil,
        grupo: this.formulario.grupo,
        activo: this.formulario.activo
      };

<<<<<<< HEAD
=======
      console.log('📤 Datos a enviar (actualización):', usuarioActualizado);

>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.accesosService.actualizarUsuario(this.usuarioSeleccionado._id!, usuarioActualizado).subscribe({
        next: () => {
          console.log('✅ Usuario actualizado exitosamente');
          this.loading = false;
          this.mensaje = '✅ Usuario actualizado correctamente';
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.mensaje = '';
            this.cerrarFormulario();
            this.cargarUsuarios();
          }, 1500);
        },
        error: (err: any) => {
          console.error('❌ Error al actualizar:', err);
          this.loading = false;
          this.error = '❌ Error al actualizar usuario: ' + (err.error?.message || err.statusText);
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log('📝 Modo: CREAR NUEVO');
      const nuevoUsuario = {
        nombre: this.formulario.nombre,
        email: this.formulario.email,
        password: this.formulario.password,
        rol: this.formulario.perfil,
        grupo: this.formulario.grupo
      };

<<<<<<< HEAD
=======
      console.log('📤 Datos a enviar (nuevo):', nuevoUsuario);

>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
      this.accesosService.crearUsuario(nuevoUsuario).subscribe({
        next: (resultado) => {
          console.log('✅ Usuario creado exitosamente:', resultado);
          this.loading = false;
          this.mensaje = '✅ Usuario creado correctamente';
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.mensaje = '';
            this.cerrarFormulario();
            this.cargarUsuarios();
          }, 1500);
        },
        error: (err: any) => {
          console.error('❌ Error al crear:', err);
          this.loading = false;
          this.error = '❌ Error al crear usuario: ' + (err.error?.message || err.statusText);
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.loading = true;
      this.accesosService.eliminarUsuario(this.usuarioSeleccionado._id!).subscribe({
        next: () => {
          this.loading = false;
          this.mensaje = '✅ Usuario eliminado correctamente';
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.mensaje = '';
            this.cerrarFormulario();
            this.cargarUsuarios();
          }, 1500);
        },
        error: (err: any) => {
          this.loading = false;
          this.error = '❌ Error al eliminar usuario: ' + (err.error?.message || err.statusText);
          this.cdr.detectChanges();
        }
      });
    }
  }

  generarPassword(): void {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    this.formulario.password = password;
  }

<<<<<<< HEAD
  resetearPassword(usuarioId: string, usuarioNombre: string): void {
    const nueva_password = prompt(`Ingresa la nueva contraseña para ${usuarioNombre}:`);
    
    if (!nueva_password) return;
=======
  /* ================= RESETEAR CONTRASEÑA ================= */
  resetearPassword(usuarioId: string, usuarioNombre: string): void {
    const nueva_password = prompt(`Ingresa la nueva contraseña para ${usuarioNombre}:`);
    
    if (!nueva_password) {
      return;
    }
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4

    if (nueva_password.length < 6) {
      this.error = 'La contraseña debe tener mínimo 6 caracteres';
      return;
    }

    if (confirm(`¿Resetear la contraseña de ${usuarioNombre}?\nEl usuario deberá cambiarla en el próximo login.`)) {
      this.actividadesService.resetearPasswordUsuario(usuarioId, nueva_password).subscribe({
        next: () => {
          this.mensaje = `✅ Contraseña de ${usuarioNombre} reseteada correctamente`;
          this.cargarUsuarios();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: any) => {
          this.error = 'Error: ' + (err.error?.message || err.statusText);
<<<<<<< HEAD
=======
          console.error('Error:', err);
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
        }
      });
    }
  }

  obtenerGrupo(usuario: Usuario): string {
    return (usuario as any).grupo || '-';
  }
<<<<<<< HEAD

  esSuperAdmin(usuario: Usuario): boolean {
    return usuario.rol?.toLowerCase() === 'super_admin';
  }

  esAdministrador(usuario: Usuario): boolean {
    return usuario.rol?.toLowerCase() === 'administrador';
  }
=======
>>>>>>> f284d1bd06979c1df65535c5f52e3a928d5c23f4
}