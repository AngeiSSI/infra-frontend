import { Injectable } from '@angular/core';

export type ListaMaestraTipo =
  | 'flujo_valor'
  | 'gerente'
  | 'celula'
  | 'lider_tecnico'
  | 'lider_tecnico_flujo_valor'
  | 'lider_infraestructura_fv'
  | 'scrum'
  | 'po'
  | 'arquitecto';

export interface ListaMaestraItem {
  id: number;
  tipo: ListaMaestraTipo;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListasMaestrasService {
  private readonly storageKey = 'listas_maestras_items';

  private itemsSeed: ListaMaestraItem[] = [
    {
      id: 1,
      tipo: 'flujo_valor',
      nombre: 'Modernización de Infraestructura',
      descripcion: 'Flujo principal de modernización de servicios',
      activo: true,
      fechaCreacion: '2026-05-18T08:00:00',
      fechaModificacion: '2026-05-18T08:00:00'
    },
    {
      id: 2,
      tipo: 'gerente',
      nombre: 'Carlos Ramírez',
      descripcion: 'Gerente de operación',
      activo: true,
      fechaCreacion: '2026-05-18T08:10:00',
      fechaModificacion: '2026-05-18T08:10:00'
    },
    {
      id: 3,
      tipo: 'celula',
      nombre: 'Célula Plataforma Core',
      descripcion: 'Equipo responsable de plataforma core',
      activo: true,
      fechaCreacion: '2026-05-18T08:20:00',
      fechaModificacion: '2026-05-18T08:20:00'
    },
    {
      id: 4,
      tipo: 'lider_tecnico',
      nombre: 'Andrea Martínez',
      descripcion: 'Líder técnico de plataforma',
      activo: true,
      fechaCreacion: '2026-05-18T08:30:00',
      fechaModificacion: '2026-05-18T08:30:00'
    },
    {
      id: 5,
      tipo: 'lider_tecnico_flujo_valor',
      nombre: 'Julián Herrera',
      descripcion: 'Líder técnico asociado a flujo de valor',
      activo: true,
      fechaCreacion: '2026-05-18T08:40:00',
      fechaModificacion: '2026-05-18T08:40:00'
    },
    {
      id: 6,
      tipo: 'scrum',
      nombre: 'Natalia Gómez',
      descripcion: 'Scrum master de célula digital',
      activo: true,
      fechaCreacion: '2026-05-18T08:50:00',
      fechaModificacion: '2026-05-18T08:50:00'
    },
    {
      id: 7,
      tipo: 'po',
      nombre: 'Sebastián Torres',
      descripcion: 'Product Owner de servicios internos',
      activo: true,
      fechaCreacion: '2026-05-18T09:00:00',
      fechaModificacion: '2026-05-18T09:00:00'
    },
    {
      id: 8,
      tipo: 'arquitecto',
      nombre: 'Laura Peña',
      descripcion: 'Arquitecta empresarial',
      activo: true,
      fechaCreacion: '2026-05-18T09:10:00',
      fechaModificacion: '2026-05-18T09:10:00'
    },
    {
      id: 9,
      tipo: 'lider_infraestructura_fv',
      nombre: 'María Fernanda Suárez',
      descripcion: 'Líder de infraestructura asociada al flujo de valor',
      activo: true,
      fechaCreacion: '2026-05-18T09:20:00',
      fechaModificacion: '2026-05-18T09:20:00'
    }
  ];

  private items: ListaMaestraItem[] = [];

  constructor() {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    const datosGuardados = localStorage.getItem(this.storageKey);

    if (datosGuardados) {
      try {
        this.items = JSON.parse(datosGuardados) as ListaMaestraItem[];
        return;
      } catch (error) {
        console.error('Error al leer listas maestras desde localStorage:', error);
      }
    }

    this.items = [...this.itemsSeed];
    this.guardarEnStorage();
  }

  private guardarEnStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  obtenerTipos(): { valor: ListaMaestraTipo; etiqueta: string }[] {
    return [
      { valor: 'flujo_valor', etiqueta: 'Flujo de valor' },
      { valor: 'gerente', etiqueta: 'Gerente' },
      { valor: 'celula', etiqueta: 'Célula' },
      { valor: 'lider_tecnico', etiqueta: 'Líder técnico' },
      { valor: 'lider_tecnico_flujo_valor', etiqueta: 'Líder técnico flujo de valor' },
      { valor: 'lider_infraestructura_fv', etiqueta: 'Líder infraestructura FV' },
      { valor: 'scrum', etiqueta: 'Scrum' },
      { valor: 'po', etiqueta: 'PO' },
      { valor: 'arquitecto', etiqueta: 'Arquitecto' }
    ];
  }

  obtenerPorTipo(tipo: ListaMaestraTipo): ListaMaestraItem[] {
    return this.items.filter(item => item.tipo === tipo);
  }

  crear(item: Omit<ListaMaestraItem, 'id' | 'fechaCreacion' | 'fechaModificacion'>): ListaMaestraItem {
    const nuevoId = this.items.length > 0 ? Math.max(...this.items.map(x => x.id)) + 1 : 1;
    const ahora = new Date().toISOString();

    const nuevoItem: ListaMaestraItem = {
      id: nuevoId,
      fechaCreacion: ahora,
      fechaModificacion: ahora,
      ...item
    };

    this.items.unshift(nuevoItem);
    this.guardarEnStorage();
    return nuevoItem;
  }

  crearMuchos(items: Omit<ListaMaestraItem, 'id' | 'fechaCreacion' | 'fechaModificacion'>[]): number {
    let cantidad = 0;

    for (const item of items) {
      const nuevoId = this.items.length > 0 ? Math.max(...this.items.map(x => x.id)) + 1 : 1;
      const ahora = new Date().toISOString();

      const nuevoItem: ListaMaestraItem = {
        id: nuevoId,
        fechaCreacion: ahora,
        fechaModificacion: ahora,
        ...item
      };

      this.items.unshift(nuevoItem);
      cantidad++;
    }

    this.guardarEnStorage();
    return cantidad;
  }

  actualizar(id: number, cambios: Partial<ListaMaestraItem>): ListaMaestraItem | null {
    const index = this.items.findIndex(item => item.id === id);

    if (index === -1) {
      return null;
    }

    this.items[index] = {
      ...this.items[index],
      ...cambios,
      fechaModificacion: new Date().toISOString()
    };

    this.guardarEnStorage();
    return this.items[index];
  }

  cambiarEstado(id: number): ListaMaestraItem | null {
    const item = this.items.find(x => x.id === id);

    if (!item) {
      return null;
    }

    item.activo = !item.activo;
    item.fechaModificacion = new Date().toISOString();

    this.guardarEnStorage();
    return item;
  }

  eliminar(id: number): boolean {
    const cantidadInicial = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    const eliminado = this.items.length < cantidadInicial;

    if (eliminado) {
      this.guardarEnStorage();
    }

    return eliminado;
  }

  limpiarTodo(): void {
    this.items = [];
    this.guardarEnStorage();
  }

  restaurarDatosIniciales(): void {
    this.items = [...this.itemsSeed];
    this.guardarEnStorage();
  }
}