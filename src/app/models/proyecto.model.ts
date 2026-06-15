export interface Proyecto {
  _id?: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  flujoValor: string;
  celula: string;
  fase: 'Planeación' | 'Ejecución' | 'Cierre';
  tipo: 'Project' | 'PEP';
  pep: string;
  
  // Gobierno
  gerente: string;
  liderTecnico: string;
  pmo?: string;
  arquitecto: string;
  productOwner: string;
  scrum?: string;
  sei: string;
  
  // Responsabilidad
  liderInfraestructura: string;
  porcentajeAsignacion: number;
  
  // Fechas
  fechaSolicitud: Date;
  fechaInicio: Date;
  fechaFin: Date;
  estado: string;
  
  macroTareas: MacroTareaProyecto[];
}

export interface MacroTareaProyecto {
  _id?: string;
  nombre: string;
  descripcion: string;
  duracionDias: number;
  dependencia: string;
  secuencia: number;
}

export interface SolicitudCierre {
  _id?: string;
  actividad: {
    codigo: string;
    nombre: string;
    proyecto: string;
    macroTarea: string;
  };
  responsable: {
    nombre: string;
    email: string;
  };
  vencimiento: Date;
  retrazo: number;
  fechaSolicitud: Date;
  justificacion: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  horasGestion: number;
}