export interface Actividad {
  _id?: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  proyecto: string;
  macroTarea: string;
  tipificacion: string;
  responsable: string;
  liderTecnico: string;
  estado: 'En Progreso' | 'Vencida' | 'Cerrada' | 'Pendiente Aprobación Cierre';
  prioridad: 'Alta' | 'Media' | 'Baja';
  flujoValor: string;
  celula: string;

  // Fechas
  fechaCreacion: Date;
  fechaCompromiso: Date;
  fechaInicio: Date;
  fechaCierreEstimada: Date;
  fechaCierreReal?: Date;

  // Horas
  horas: number;
  horasAcumuladas: number;
  horasMinimas: number;
  horasMaximas: number;

  // Seguimiento
  diasSinGestion: number;
  ultimaGestion: Date;
  estado_semaforo?: 'Gestionada' | 'En Riesgo' | 'Sin Gestión';
  progreso: number;
}

export interface Gestion {
  _id?: string;
  fecha: Date;
  usuario: string;
  comentario: string;
  horas: number;
  tipo: 'Observación' | 'Actualización' | 'Cierre';
}

export interface HistorialActividad {
  fecha: Date;
  evento: string;
  usuario: string;
  tipo: 'Creación' | 'Inicio' | 'Compromiso' | 'Vencimiento' | 'Cierre';
}

export interface DocumentoAdjunto {
  _id?: string;
  nombre: string;
  tipo: string;
  tamaño: number;
  fecha: Date;
  usuario: string;
  url?: string;
}

export interface AuditoriaActividad {
  fecha: Date;
  usuario: string;
  accion: string;
  cambios: string;
}