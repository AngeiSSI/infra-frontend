import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Lider {
  _id: string;
  nombre: string;
  capacidadTotal: number;
  capacidadAsignada: number;
  capacidadDisponible: number;
  estado: 'Disponible' | 'Capacidad Comprometida' | 'Sobreasignado';
}

interface Proyecto {
  _id: string;
  nombre: string;
  porcentajeAsignacion: number;
  capacidadUsada: number;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-asignaciones-mejorado',
  templateUrl: './asignaciones-mejorado.component.html',
  styleUrls: ['./asignaciones-mejorado.component.css']
})
export class AsignacionesMejoradoComponent implements OnInit {
  
  lideres: Lider[] = [];
  liderSeleccionado: Lider | null = null;
  proyectosDelLider: Proyecto[] = [];
  
  // KPIs
  capacidadTotal = 0;
  capacidadPromedio = 0;
  lideresAlCien = 0;
  lideressobreasignados = 0;

  // Filtros
  formularioFiltros: FormGroup;
  estados = ['Todos', 'Disponible', 'Capacidad Comprometida', 'Sobreasignado'];
  rangosCapacidad = ['Todos', '0%-99%', '100%-119%', '≥120%'];

  cargando = false;
  apiUrl = '/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.formularioFiltros = this.fb.group({
      buscar: [''],
      estado: ['Todos'],
      rangoCapacidad: ['Todos'],
      proyecto: ['Todos']
    });
  }

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.cargando = true;
    const filtros = this.formularioFiltros.value;

    this.http.get<any>(`${this.apiUrl}/asignaciones/capacidad`, { params: filtros }).subscribe(
      (response) => {
        if (response.success) {
          this.lideres = response.data.lideres;
          this.calcularKPIs();
          this.cargando = false;
        }
      },
      (error) => {
        console.error('Error:', error);
        this.cargando = false;
      }
    );
  }

  calcularKPIs(): void {
    this.capacidadTotal = this.lideres.length;
    
    this.capacidadPromedio = this.lideres.length > 0
      ? Math.round(
          this.lideres.reduce((sum, l) => sum + (l.capacidadAsignada / l.capacidadTotal * 100), 0) / 
          this.lideres.length
        )
      : 0;

    this.lideresAlCien = this.lideres.filter(
      l => (l.capacidadAsignada / l.capacidadTotal) >= 1.0
    ).length;

    this.lideressobreasignados = this.lideres.filter(
      l => (l.capacidadAsignada / l.capacidadTotal) > 1.2
    ).length;
  }

  seleccionarLider(lider: Lider): void {
    this.liderSeleccionado = lider;
    this.cargarProyectosDelLider(lider._id);
  }

  cargarProyectosDelLider(liderId: string): void {
    this.http.get<any>(`${this.apiUrl}/asignaciones/lider/${liderId}/proyectos`).subscribe(
      (response) => {
        if (response.success) {
          this.proyectosDelLider = response.data;
        }
      },
      (error) => console.error('Error:', error)
    );
  }

  obtenerClaseCapacidad(lider: Lider): string {
    const porcentaje = (lider.capacidadAsignada / lider.capacidadTotal) * 100;
    
    if (porcentaje < 100) return 'disponible';
    if (porcentaje < 120) return 'comprometida';
    return 'sobreasignado';
  }

  obtenerColorBarra(porcentaje: number): string {
    if (porcentaje < 100) return '#06A77D'; // Verde
    if (porcentaje < 120) return '#F77F00'; // Naranja
    return '#E63946'; // Rojo
  }

  obtenerEstadoTexto(lider: Lider): string {
    const porcentaje = (lider.capacidadAsignada / lider.capacidadTotal) * 100;
    
    if (porcentaje < 100) return 'Disponible';
    if (porcentaje < 120) return 'Capacidad Comprometida';
    return 'Sobreasignado';
  }

  aplicarFiltros(): void {
    this.cargarAsignaciones();
  }

  limpiarFiltros(): void {
    this.formularioFiltros.reset({
      buscar: '',
      estado: 'Todos',
      rangoCapacidad: 'Todos',
      proyecto: 'Todos'
    });
    this.cargarAsignaciones();
  }

  exportarDatos(): void {
    // Implementar exportación
    alert('Exportación en desarrollo');
  }

  actualizarCapacidad(liderId: string): void {
    // Navegar a modal de actualización
    alert('Actualización de capacidad en desarrollo');
  }

  verAlertasConfiguradas(): void {
    alert('Ver alertas configuradas en desarrollo');
  }
}