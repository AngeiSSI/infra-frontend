export interface MacroTarea {
  _id?: string;
  nombre: string;
  descripcion: string;
  tipificacion: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  estado: 'Vigente' | 'Pendiente' | 'Histórico';
  ultimaModificacion: Date;
  modificadoPor: string;
}

export interface MacroTareaWizard {
  nombre: string;
  descripcion: string;
  liderInfraestructura: string;
  estado: string;
  tipo: string;
  microTareas: MicroTareaSeleccionada[];
}

export interface MicroTareaSeleccionada {
  _id?: string;
  actividad: string;
  catalogoId: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  orden: number;
  dependencia?: string;
}

export interface CatalogoActividad {
  _id?: string;
  codigo: string;
  tipificacion: string;
  actividad: string;
  diasHabiles: number;
  horasMinimas: number;
  horasMaximas: number;
  estado: 'Vigente' | 'Pendiente' | 'Histórico';
  ultimaModificacion: Date;
  modificadoPor: string;
}