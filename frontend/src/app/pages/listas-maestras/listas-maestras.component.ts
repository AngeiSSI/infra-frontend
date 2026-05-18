import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListaMaestraItem,
  ListaMaestraTipo,
  ListasMaestrasService
} from '../../services/listas-maestras.service';

@Component({
  selector: 'app-listas-maestras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listas-maestras.html',
  styleUrls: ['./listas-maestras.css']
})
export class ListasMaestrasComponent implements OnInit {
  tipos: { valor: ListaMaestraTipo; etiqueta: string }[] = [];
  tipoSeleccionado: ListaMaestraTipo = 'flujo_valor';
  items: ListaMaestraItem[] = [];
  itemsFiltrados: ListaMaestraItem[] = [];
  terminoBusqueda: string = '';

  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;

  formulario = {
    id: 0,
    nombre: '',
    descripcion: '',
    activo: true
  };

  constructor(private listasMaestrasService: ListasMaestrasService) {}

  ngOnInit(): void {
    this.tipos = this.listasMaestrasService.obtenerTipos();
    this.cargarItems();
  }

  seleccionarTipo(tipo: ListaMaestraTipo): void {
    this.tipoSeleccionado = tipo;
    this.terminoBusqueda = '';
    this.cancelarFormulario();
    this.cargarItems();
  }

  cargarItems(): void {
    this.items = this.listasMaestrasService.obtenerPorTipo(this.tipoSeleccionado);
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();

    if (!termino) {
      this.itemsFiltrados = [...this.items];
      return;
    }

    this.itemsFiltrados = this.items.filter(item =>
      item.nombre.toLowerCase().includes(termino) ||
      item.descripcion.toLowerCase().includes(termino)
    );
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda = input.value;
    this.aplicarFiltro();
  }

  abrirCrear(): void {
    this.modoFormulario = 'crear';
    this.mostrarFormulario = true;
    this.formulario = {
      id: 0,
      nombre: '',
      descripcion: '',
      activo: true
    };
  }

  editarItem(item: ListaMaestraItem): void {
    this.modoFormulario = 'editar';
    this.mostrarFormulario = true;
    this.formulario = {
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      activo: item.activo
    };
  }

  guardar(): void {
    const nombre = this.formulario.nombre.trim();
    const descripcion = this.formulario.descripcion.trim();

    if (!nombre) {
      alert('El nombre es obligatorio.');
      return;
    }

    if (this.modoFormulario === 'crear') {
      this.listasMaestrasService.crear({
        tipo: this.tipoSeleccionado,
        nombre,
        descripcion,
        activo: this.formulario.activo
      });
    } else {
      this.listasMaestrasService.actualizar(this.formulario.id, {
        nombre,
        descripcion,
        activo: this.formulario.activo
      });
    }

    this.cargarItems();
    this.cancelarFormulario();
  }

  cambiarEstado(item: ListaMaestraItem): void {
    this.listasMaestrasService.cambiarEstado(item.id);
    this.cargarItems();
  }

  eliminar(item: ListaMaestraItem): void {
    const confirmar = confirm(`¿Deseas eliminar "${item.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.listasMaestrasService.eliminar(item.id);
    this.cargarItems();
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.formulario = {
      id: 0,
      nombre: '',
      descripcion: '',
      activo: true
    };
  }

  obtenerEtiquetaTipoActual(): string {
    return this.tipos.find(tipo => tipo.valor === this.tipoSeleccionado)?.etiqueta || '';
  }

  onNombreChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formulario.nombre = input.value;
  }

  onDescripcionChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.formulario.descripcion = input.value;
  }

  onActivoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formulario.activo = input.checked;
  }

  descargarPlantillaCSV(): void {
    const contenido = 'nombre,descripcion,activo\nEjemplo 1,Descripción ejemplo,true\nEjemplo 2,Otra descripción,true';
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = `plantilla_${this.tipoSeleccionado}.csv`;
    enlace.click();

    window.URL.revokeObjectURL(url);
  }

  importarCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      const contenido = lector.result as string;
      const registros = this.parsearCSV(contenido);

      if (registros.length === 0) {
        alert('No se encontraron registros válidos para importar.');
        input.value = '';
        return;
      }

      const cantidad = this.listasMaestrasService.crearMuchos(
        registros.map(registro => ({
          tipo: this.tipoSeleccionado,
          nombre: registro.nombre,
          descripcion: registro.descripcion,
          activo: registro.activo
        }))
      );

      this.cargarItems();
      alert(`Se importaron ${cantidad} registro(s) en ${this.obtenerEtiquetaTipoActual()}.`);
      input.value = '';
    };

    lector.readAsText(archivo, 'utf-8');
  }

  private parsearCSV(contenido: string): { nombre: string; descripcion: string; activo: boolean }[] {
    const lineas = contenido
      .split(/\r?\n/)
      .map(linea => linea.trim())
      .filter(linea => linea.length > 0);

    if (lineas.length <= 1) {
      return [];
    }

    const encabezados = lineas[0].split(',').map(valor => valor.trim().toLowerCase());
    const indiceNombre = encabezados.indexOf('nombre');
    const indiceDescripcion = encabezados.indexOf('descripcion');
    const indiceActivo = encabezados.indexOf('activo');

    if (indiceNombre === -1) {
      alert('El archivo debe contener la columna "nombre".');
      return [];
    }

    const resultado: { nombre: string; descripcion: string; activo: boolean }[] = [];

    for (let i = 1; i < lineas.length; i++) {
      const columnas = lineas[i].split(',').map(valor => valor.trim());

      const nombre = columnas[indiceNombre]?.trim() || '';
      const descripcion = indiceDescripcion >= 0 ? (columnas[indiceDescripcion]?.trim() || '') : '';
      const activoTexto = indiceActivo >= 0 ? (columnas[indiceActivo]?.trim().toLowerCase() || 'true') : 'true';

      if (!nombre) {
        continue;
      }

      const activo = activoTexto === 'true' || activoTexto === '1' || activoTexto === 'si' || activoTexto === 'sí';

      resultado.push({
        nombre,
        descripcion,
        activo
      });
    }

    return resultado;
  }
}