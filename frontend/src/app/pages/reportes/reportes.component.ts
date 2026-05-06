import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent implements OnInit {
  // Datos generales
  actividades: any[] = [];
  filtroEstado = 'todos';
  filtroBusqueda = '';
  
  // Estadísticas
  totalActividades = 0;
  actividadesVencidas = 0;
  actividadesProximas = 0;
  actividadesActivas = 0;
  actividadesCerradas = 0;
  
  // Por usuario
  usuariosResumen: any[] = [];
  
  // Por proyecto
  proyectosResumen: any[] = [];
  
  // Horas
  totalHoras = 0;
  horasAcumuladas = 0;
  horasPendientes = 0;

  cargando = false;
  actividad = 'general';

  constructor(private actividadesService: ActividadesService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

cargarDatos(): void {
  this.cargando = true;
  this.actividadesService.obtenerActividades().subscribe({
    next: (data: any[]) => {
      this.actividades = data;
      this.procesarDatos();
      this.cargando = false;
    },
    error: (err: any) => {
      console.error('Error al cargar actividades:', err);
      this.cargando = false;
    }
  });
}

  procesarDatos(): void {
    const hoy = new Date();

    // Reiniciar contadores
    this.totalActividades = this.actividades.length;
    this.actividadesVencidas = 0;
    this.actividadesProximas = 0;
    this.actividadesActivas = 0;
    this.actividadesCerradas = 0;
    this.totalHoras = 0;
    this.horasAcumuladas = 0;

    const usuariosMap = new Map();
    const proyectosMap = new Map();

    for (const act of this.actividades) {
      // Contar por estado
      if (act.estado === 'cerrado') {
        this.actividadesCerradas++;
      } else {
        this.actividadesActivas++;

        // Calcular días restantes
        const diasRestantes = this.calcularDiasHabiles(hoy, new Date(act.fechaCierre));

        if (diasRestantes < 0) {
          this.actividadesVencidas++;
        } else if (diasRestantes <= 2) {
          this.actividadesProximas++;
        }
      }

      // Sumar horas
      this.totalHoras += act.horas || 0;
      this.horasAcumuladas += act.horasAcumuladas || 0;

      // Agrupar por usuario
      const usuarioKey = act.lider;
      if (!usuariosMap.has(usuarioKey)) {
        usuariosMap.set(usuarioKey, {
          nombre: act.lider,
          activas: 0,
          vencidas: 0,
          cerradas: 0,
          horas: 0
        });
      }
      const usuario = usuariosMap.get(usuarioKey);
      if (act.estado === 'cerrado') {
        usuario.cerradas++;
      } else {
        usuario.activas++;
        const diasRestantes = this.calcularDiasHabiles(hoy, new Date(act.fechaCierre));
        if (diasRestantes < 0) {
          usuario.vencidas++;
        }
      }
      usuario.horas += act.horasAcumuladas || 0;

      // Agrupar por proyecto
      const proyectoKey = act.proyecto;
      if (!proyectosMap.has(proyectoKey)) {
        proyectosMap.set(proyectoKey, {
          nombre: act.proyecto,
          total: 0,
          vencidas: 0,
          cerradas: 0,
          horas: 0
        });
      }
      const proyecto = proyectosMap.get(proyectoKey);
      proyecto.total++;
      if (act.estado === 'cerrado') {
        proyecto.cerradas++;
      } else {
        const diasRestantes = this.calcularDiasHabiles(hoy, new Date(act.fechaCierre));
        if (diasRestantes < 0) {
          proyecto.vencidas++;
        }
      }
      proyecto.horas += act.horasAcumuladas || 0;
    }

    this.usuariosResumen = Array.from(usuariosMap.values())
      .sort((a, b) => b.vencidas - a.vencidas);

    this.proyectosResumen = Array.from(proyectosMap.values())
      .sort((a, b) => b.vencidas - a.vencidas);

    this.horasPendientes = this.totalHoras - this.horasAcumuladas;
  }

  calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {
  let diasHabiles = 0;
  let fechaActual = new Date(fechaInicio);
  
  // Normalizar horas a medianoche para comparación correcta
  fechaActual.setHours(0, 0, 0, 0);
  const fechaFinNormalizada = new Date(fechaFin);
  fechaFinNormalizada.setHours(0, 0, 0, 0);

  // Si la fecha fin es menor a la actual, retornar negativo
  if (fechaFinNormalizada < fechaActual) {
    return -Math.abs(this.calcularDiasHabilesPositivos(fechaFinNormalizada, fechaActual));
  }

  return this.calcularDiasHabilesPositivos(fechaActual, fechaFinNormalizada);
}

private calcularDiasHabilesPositivos(fechaInicio: Date, fechaFin: Date): number {
  let diasHabiles = 0;
  let fechaActual = new Date(fechaInicio);

  while (fechaActual < fechaFin) {
    const dia = fechaActual.getDay();
    if (dia !== 0 && dia !== 6) {
      diasHabiles++;
    }
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  return diasHabiles;
}

  get actividadesFiltradas(): any[] {
    return this.actividades.filter(act => {
      const cumpleEstado = 
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'vencidas' && this.esVencida(act)) ||
        (this.filtroEstado === 'proximas' && this.esProxima(act)) ||
        (this.filtroEstado === 'activas' && act.estado === 'en progreso') ||
        (this.filtroEstado === 'cerradas' && this.esCerrada(act.estado));

      const cumpleBusqueda = 
        act.actividadCatalogo.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        act.lider.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        act.proyecto.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      return cumpleEstado && cumpleBusqueda;
    });
  }

 esVencida(act: any): boolean {
  if (act.estado === 'cerrado') return false;
  if (!act.fechaCierre) return false;
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const fechaCierre = new Date(act.fechaCierre);
  fechaCierre.setHours(0, 0, 0, 0);
  
  return fechaCierre < hoy; // Si la fecha de cierre ya pasó
}

private esCerrada(estado?: string): boolean {
  return estado === 'cerrado' || estado === 'cerrada_vencida';
}

esProxima(act: any): boolean {
  if (act.estado === 'cerrado') return false;
  if (!act.fechaCierre) return false;
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const fechaCierre = new Date(act.fechaCierre);
  fechaCierre.setHours(0, 0, 0, 0);
  
  // Próxima a vencer: entre hoy y 2 días hábiles
  const diasRestantes = this.calcularDiasHabiles(hoy, fechaCierre);
  return diasRestantes > 0 && diasRestantes <= 2;
}

  cambiarActividad(tab: string): void {
    this.actividad = tab;
  }

  obtenerPorcentajeVencidas(): number {
    if (this.actividadesActivas === 0) return 0;
    return Math.round((this.actividadesVencidas / this.actividadesActivas) * 100);
  }

  obtenerPorcentajeCerradas(): number {
    if (this.totalActividades === 0) return 0;
    return Math.round((this.actividadesCerradas / this.totalActividades) * 100);
  }

  obtenerColorSalud(): string {
    const porcentaje = this.obtenerPorcentajeVencidas();
    if (porcentaje === 0) return '#4CAF50';
    if (porcentaje < 20) return '#FFC107';
    if (porcentaje < 50) return '#FF9800';
    return '#FF5252';
  }

  exportarCSV(): void {
    let csv = 'Actividad,Líder,Proyecto,Estado,Fecha Cierre,Horas,Horas Acumuladas\n';
    
    for (const act of this.actividadesFiltradas) {
      const estadoCaso = this.esVencida(act) ? 'VENCIDA' : 
                         this.esProxima(act) ? 'POR VENCER' : 
                         act.estado;
      csv += `"${act.actividadCatalogo}","${act.lider}","${act.proyecto}","${estadoCaso}","${act.fechaCierre}",${act.horas},${act.horasAcumuladas}\n`;
    }

    const elemento = document.createElement('a');
    elemento.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    elemento.download = 'reporte-actividades.csv';
    elemento.click();
  }
}