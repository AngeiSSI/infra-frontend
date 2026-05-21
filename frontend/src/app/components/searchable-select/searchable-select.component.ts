import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  _id?: string;
  id?: string;
  nombre?: string;
  name?: string;
  value?: string;
  label?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="searchable-select-wrapper">
      <input
        #searchInput
        type="text"
        class="search-input"
        placeholder="{{ placeholder }}"
        [(ngModel)]="searchTerm"
        (ngModelChange)="filtrarOpciones()"
        (focus)="abrirOpciones()"
        (blur)="cerrarOpciones()"
        autocomplete="off"
      >

      <div class="select-options" *ngIf="mostrarOpciones && opcionesFiltradas.length > 0">
        <div
          *ngFor="let opcion of opcionesFiltradas"
          class="select-option"
          (mousedown)="seleccionar(opcion)"
        >
          {{ obtenerTexto(opcion) }}
        </div>
      </div>

      <div class="select-empty" *ngIf="mostrarOpciones && searchTerm.length > 0 && opcionesFiltradas.length === 0">
        No hay coincidencias
      </div>

      <div class="selected-value" *ngIf="!mostrarOpciones && valorSeleccionado">
        ✓ {{ valorSeleccionado }}
      </div>
    </div>
  `,
  styles: [`
    .searchable-select-wrapper {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 0.85rem 0.95rem;
      border: 1.5px solid #dde3ea;
      border-radius: 12px;
      font-size: 0.95rem;
      background: #fff;
      transition: all 0.25s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .search-input:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.10);
    }

    .select-options {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1.5px solid #dde3ea;
      border-top: none;
      border-radius: 0 0 12px 12px;
      max-height: 250px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
    }

    .select-option {
      padding: 0.85rem 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.95rem;
      color: #374151;
      user-select: none;
    }

    .select-option:hover {
      background: #f3f4f6;
      color: #0066cc;
      font-weight: 500;
    }

    .select-option:last-child {
      border-bottom: none;
      border-radius: 0 0 12px 12px;
    }

    .select-empty {
      padding: 1rem;
      text-align: center;
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .selected-value {
      padding: 0.85rem 0.95rem;
      color: #0066cc;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .select-options::-webkit-scrollbar {
      width: 6px;
    }

    .select-options::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .select-options::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .select-options::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class SearchableSelectComponent implements OnInit, OnChanges {
  @Input() opciones: SelectOption[] = [];
  @Input() placeholder: string = 'Busca una opción...';
  @Input() campoMostrar: string = 'nombre';
  @Input() valorInicial: string = '';
  @Output() seleccionChanged = new EventEmitter<SelectOption>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm: string = '';
  opcionesFiltradas: SelectOption[] = [];
  mostrarOpciones: boolean = false;
  valorSeleccionado: string = '';

  ngOnInit(): void {
    this.inicializarOpciones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opciones']) {
      this.inicializarOpciones();
    }
  }

  inicializarOpciones(): void {
    this.opcionesFiltradas = [...this.opciones].sort((a, b) =>
      this.obtenerTexto(a).localeCompare(this.obtenerTexto(b), 'es', { sensitivity: 'base' })
    );
  }

  obtenerTexto(opcion: SelectOption): string {
    return opcion[this.campoMostrar] || opcion.nombre || opcion.name || opcion.value || '';
  }

  filtrarOpciones(): void {
    const termino = this.searchTerm
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    if (termino.length === 0) {
      this.opcionesFiltradas = [...this.opciones].sort((a, b) =>
        this.obtenerTexto(a).localeCompare(this.obtenerTexto(b), 'es', { sensitivity: 'base' })
      );
    } else {
      this.opcionesFiltradas = this.opciones
        .filter(opcion => {
          const texto = this.obtenerTexto(opcion)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          return texto.includes(termino);
        })
        .sort((a, b) =>
          this.obtenerTexto(a).localeCompare(this.obtenerTexto(b), 'es', { sensitivity: 'base' })
        );
    }

    this.mostrarOpciones = true;
  }

  abrirOpciones(): void {
    this.mostrarOpciones = true;
    this.filtrarOpciones();
  }

  seleccionar(opcion: SelectOption): void {
    this.valorSeleccionado = this.obtenerTexto(opcion);
    this.searchTerm = '';
    this.mostrarOpciones = false;
    this.seleccionChanged.emit(opcion);
  }

  cerrarOpciones(): void {
    setTimeout(() => {
      if (!this.searchInput.nativeElement.value) {
        this.mostrarOpciones = false;
        this.searchTerm = '';
      }
    }, 200);
  }

  resetear(): void {
    this.searchTerm = '';
    this.valorSeleccionado = '';
    this.mostrarOpciones = false;
    this.inicializarOpciones();
  }
}