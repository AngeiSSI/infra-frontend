export interface Asignacion {
  _id?: string;
  proyecto: string;
  lider: string;
  porcentajeAsignacion: number;
  capacidadDisponible: number;
  capacidadTotal: number;
  estado: 'Vigente' | 'Pendiente' | 'Inactivo';
  macroTareas: string[];
  fechaInicio: Date;
  fechaFin: Date;
  observaciones?: string;
}

export interface CapacidadLider {
  _id?: string;
  nombre: string;
  capacidadTotal: number;
  capacidadAsignada: number;
  capacidadDisponible: number;
  estado: 'Disponible' | 'Capacidad Comprometida' | 'Sobreasignado';
  proyectos: AsignacionProyecto[];
}

export interface AsignacionProyecto {
  proyecto: string;
  porcentajeAsignacion: number;
  capacidadUsada: number;
  estado: 'Activo' | 'Inactivo';
}