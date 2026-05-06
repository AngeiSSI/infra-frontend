import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FestivosService } from '../../services/festivos.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-festivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './festivos.component.html'
})
export class FestivosComponent implements OnInit {
  festivos: any[] = [];
  nuevoFestivo = {
    fecha: '',
    descripcion: ''
  };
  
  festivoEnEdicion: any = null;
  loading = false;
  error = '';
  errorHTML = '';
  mensaje = '';
  usuario: any = null;

  constructor(
    private festivosService: FestivosService,
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

    const rol = this.usuario.rol?.toLowerCase();
    if (rol !== 'administrador' && rol !== 'super_admin') {
      this.router.navigate(['/actividades']);
      return;
    }

    this.cargarFestivos();
  }

  cargarFestivos(): void {
    this.festivosService.getFestivos().subscribe({
      next: (data: any[]) => {
        console.log('✅ Festivos cargados:', data);
        this.festivos = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error al cargar festivos:', err);
        this.error = 'Error al cargar festivos: ' + (err.error?.message || err.statusText);
        this.cdr.detectChanges();
      }
    });
  }

  iniciarEdicion(festivo: any): void {
    console.log('✏️ Iniciando edición de festivo:', festivo);
    
    this.festivoEnEdicion = { ...festivo };
    
    // Convertir fecha a formato YYYY-MM-DD para el input date
    const fecha = new Date(festivo.fecha);
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    this.nuevoFestivo = {
      fecha: `${anio}-${mes}-${dia}`,
      descripcion: festivo.descripcion
    };
    
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();
    
    // Scroll al formulario
    setTimeout(() => {
      document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  cancelarEdicion(): void {
    console.log('❌ Cancelando edición');
    this.festivoEnEdicion = null;
    this.nuevoFestivo = { fecha: '', descripcion: '' };
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();
  }

  guardarEdicion(): void {
    if (!this.nuevoFestivo.fecha || !this.nuevoFestivo.descripcion.trim()) {
      this.error = 'Debes ingresar fecha y descripción';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();

    // Crear fecha sin problemas de zona horaria
    const partes = this.nuevoFestivo.fecha.split('-');
    const anio = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const dia = parseInt(partes[2]);

    // Crear fecha sin UTC - solo la fecha local
    const fechaLocal = new Date(anio, mes - 1, dia, 0, 0, 0, 0);
    const fechaISO = fechaLocal.toISOString();

    console.log('📤 Guardando cambios del festivo:');
    console.log('   Fecha input:', this.nuevoFestivo.fecha);
    console.log('   Fecha local:', fechaLocal);
    console.log('   Fecha ISO:', fechaISO);

    // Primero eliminar
    this.festivosService.eliminarFestivo(this.festivoEnEdicion._id).subscribe({
      next: () => {
        console.log('✅ Festivo viejo eliminado');
        
        // Luego agregar el nuevo con la fecha correcta
        this.festivosService.agregarFestivo(fechaISO, this.nuevoFestivo.descripcion).subscribe({
          next: (respuesta: any) => {
            console.log('✅ Festivo actualizado:', respuesta);
            this.loading = false;
            this.mensaje = '✅ Festivo modificado correctamente';
            this.nuevoFestivo = { fecha: '', descripcion: '' };
            this.festivoEnEdicion = null;
            this.error = '';
            this.errorHTML = '';
            this.cdr.detectChanges();
            
            setTimeout(() => {
              this.cargarFestivos();
              this.mensaje = '';
              this.cdr.detectChanges();
            }, 1000);
          },
          error: (err: any) => {
            console.error('❌ Error al guardar:', err);
            this.loading = false;
            
            // Mostrar error detallado si hay actividades afectadas
            if (err.error?.actividadesAfectadas && Array.isArray(err.error.actividadesAfectadas)) {
              let mensajeDetallado = err.error.error + '<br><br>📌 Actividades afectadas:<br>';
              err.error.actividadesAfectadas.forEach((actividad: any, idx: number) => {
                mensajeDetallado += `<br>${idx + 1}. <strong>${actividad.nombre}</strong><br>&nbsp;&nbsp;&nbsp;• Líder: ${actividad.lider}<br>&nbsp;&nbsp;&nbsp;• Proyecto: ${actividad.proyecto}`;
              });
              this.errorHTML = mensajeDetallado;
            } else {
              this.errorHTML = err.error?.error || 'Error al guardar festivo: ' + err.statusText;
            }
            
            console.log('🔴 errorHTML:', this.errorHTML);
            this.cdr.detectChanges();
          }
        });
      },
      error: (err: any) => {
        console.error('❌ Error al eliminar:', err);
        this.loading = false;
        
        // Mostrar error detallado si hay actividades afectadas
        if (err.error?.actividadesAfectadas && Array.isArray(err.error.actividadesAfectadas)) {
          let mensajeDetallado = err.error.error + '<br><br>📌 Actividades afectadas:<br>';
          err.error.actividadesAfectadas.forEach((actividad: any, idx: number) => {
            mensajeDetallado += `<br>${idx + 1}. <strong>${actividad.nombre}</strong><br>&nbsp;&nbsp;&nbsp;• Líder: ${actividad.lider}<br>&nbsp;&nbsp;&nbsp;• Proyecto: ${actividad.proyecto}`;
          });
          this.errorHTML = mensajeDetallado;
        } else {
          this.errorHTML = err.error?.error || 'Error al guardar: ' + err.statusText;
        }
        
        console.log('🔴 errorHTML:', this.errorHTML);
        this.cdr.detectChanges();
      }
    });
  }

  agregarFestivo(): void {
    if (!this.nuevoFestivo.fecha || !this.nuevoFestivo.descripcion.trim()) {
      this.error = 'Debes ingresar fecha y descripción';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();

    // Crear fecha sin problemas de zona horaria
    const partes = this.nuevoFestivo.fecha.split('-');
    const anio = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const dia = parseInt(partes[2]);

    // Crear fecha sin UTC - solo la fecha local
    const fechaLocal = new Date(anio, mes - 1, dia, 0, 0, 0, 0);
    const fechaISO = fechaLocal.toISOString();

    console.log('📤 Agregando festivo:');
    console.log('   Fecha input:', this.nuevoFestivo.fecha);
    console.log('   Fecha local:', fechaLocal);
    console.log('   Fecha ISO:', fechaISO);

    this.festivosService.agregarFestivo(fechaISO, this.nuevoFestivo.descripcion).subscribe({
      next: (respuesta: any) => {
        console.log('✅ Festivo agregado:', respuesta);
        this.loading = false;
        this.mensaje = '✅ Festivo agregado correctamente';
        this.nuevoFestivo = { fecha: '', descripcion: '' };
        this.error = '';
        this.errorHTML = '';
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.cargarFestivos();
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 1000);
      },
      error: (err: any) => {
        console.error('❌ Error:', err);
        this.loading = false;
        
        // Mostrar error detallado si hay actividades afectadas
        if (err.error?.actividadesAfectadas && Array.isArray(err.error.actividadesAfectadas)) {
          let mensajeDetallado = err.error.error + '<br><br>📌 Actividades afectadas:<br>';
          err.error.actividadesAfectadas.forEach((actividad: any, idx: number) => {
            mensajeDetallado += `<br>${idx + 1}. <strong>${actividad.nombre}</strong><br>&nbsp;&nbsp;&nbsp;• Líder: ${actividad.lider}<br>&nbsp;&nbsp;&nbsp;• Proyecto: ${actividad.proyecto}`;
          });
          this.errorHTML = mensajeDetallado;
        } else {
          this.errorHTML = err.error?.error || 'Error al agregar festivo: ' + err.statusText;
        }
        
        console.log('🔴 errorHTML:', this.errorHTML);
        this.cdr.detectChanges();
      }
    });
  }

  eliminarFestivo(id: string, index: number): void {
    this.loading = true;
    this.error = '';
    this.errorHTML = '';
    this.cdr.detectChanges();

    this.festivosService.eliminarFestivo(id).subscribe({
      next: (respuesta: any) => {
        console.log('✅ Festivo eliminado:', respuesta);
        this.loading = false;
        this.festivos.splice(index, 1);
        this.mensaje = '✅ Festivo eliminado correctamente';
        this.error = '';
        this.errorHTML = '';
        
        setTimeout(() => {
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 2000);
        
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error al eliminar:', err);
        this.loading = false;
        
        // Mostrar error detallado si hay actividades afectadas
        if (err.error?.actividadesAfectadas && Array.isArray(err.error.actividadesAfectadas)) {
          let mensajeDetallado = err.error.error + '<br><br>📌 Actividades afectadas:<br>';
          err.error.actividadesAfectadas.forEach((actividad: any, idx: number) => {
            mensajeDetallado += `<br>${idx + 1}. <strong>${actividad.nombre}</strong><br>&nbsp;&nbsp;&nbsp;• Líder: ${actividad.lider}<br>&nbsp;&nbsp;&nbsp;• Proyecto: ${actividad.proyecto}`;
          });
          this.errorHTML = mensajeDetallado;
        } else {
          this.errorHTML = err.error?.error || 'Error al eliminar festivo: ' + err.statusText;
        }
        
        console.log('🔴 errorHTML:', this.errorHTML);
        this.cdr.detectChanges();
      }
    });
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return '-';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerResumenPorAnio(): any[] {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Agrupar por año
    const porAnio: any = {};

    this.festivos.forEach((f: any) => {
      const fecha = new Date(f.fecha);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth();
      const mesNombre = meses[mes];

      if (!porAnio[anio]) {
        porAnio[anio] = {
          anio: anio,
          meses: {}
        };
      }

      if (!porAnio[anio].meses[mes]) {
        porAnio[anio].meses[mes] = {
          nombre: mesNombre,
          cantidad: 0,
          fechas: []
        };
      }

      porAnio[anio].meses[mes].cantidad++;
      porAnio[anio].meses[mes].fechas.push(this.formatearFecha(f.fecha));
    });

    // Convertir a array y ordenar
    return Object.values(porAnio)
      .sort((a: any, b: any) => a.anio - b.anio)
      .map((anio: any) => ({
        ...anio,
        meses: Object.values(anio.meses).sort((a: any, b: any) => {
          return meses.indexOf(a.nombre) - meses.indexOf(b.nombre);
        })
      }));
  }
}