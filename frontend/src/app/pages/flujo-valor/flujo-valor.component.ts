import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlujoValorService } from '../../services/flujo-valor.service';
import { AuthService } from '../../services/auth.service';

type ManualFlags = {
  tipologia: boolean;
  gerente: boolean;
  flujo: boolean;
  celula: boolean;
};

@Component({
  selector: 'app-flujo-valor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flujo-valor.component.html'
})
export class FlujoValorComponent implements OnInit {
  flujos: any[] = [];
  flujoEnEdicion: any = null;

  // Listas para dropdowns
  tipologias: string[] = [];
  gerentes: string[] = [];
  flujosFiltrados: string[] = [];
  celulasFiltradas: string[] = [];
  lideresTecnicosFV: string[] = [];
  scrumMasters: string[] = [];
  productOwners: string[] = [];

  // Estados para crear nuevos valores
  creandoNuevo: { [key: string]: boolean } = {};
  nuevoValorInput: { [key: string]: string } = {};

  // Flags para no borrar el formulario cuando el usuario crea manualmente
  manual: ManualFlags = {
    tipologia: false,
    gerente: false,
    flujo: false,
    celula: false
  };

  // Formulario (sin liderTecnicoCelula)
  nuevoFlujo = {
    tipologia: '',
    gerente: '',
    flujodeValor: '',
    celula: '',
    liderTecnicoFlujoValor: '',
    scrum: '',
    po: ''
  };

  loading = false;
  error = '';
  errorHTML = '';
  mensaje = '';
  usuario: any = null;

  constructor(
    private flujoValorService: FlujoValorService,
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
    const rolesPermitidos = ['administrador', 'super_admin', 'coordinador', 'senior'];

    if (!rolesPermitidos.includes(rol)) {
      this.router.navigate(['/actividades']);
      return;
    }

    this.cargarFlujos();
    this.cargarTipologias();
    this.cargarTodosLosLideres();
  }

  private addUnique(list: string[], value: string): string[] {
    const v = (value || '').trim();
    if (!v) return list;
    return list.includes(v) ? list : [v, ...list];
  }

  private resetManualFlags(from: 'tipologia' | 'gerente' | 'flujo' | 'celula'): void {
    if (from === 'tipologia') {
      this.manual.tipologia = false;
      this.manual.gerente = false;
      this.manual.flujo = false;
      this.manual.celula = false;
      return;
    }
    if (from === 'gerente') {
      this.manual.gerente = false;
      this.manual.flujo = false;
      this.manual.celula = false;
      return;
    }
    if (from === 'flujo') {
      this.manual.flujo = false;
      this.manual.celula = false;
      return;
    }
    if (from === 'celula') {
      this.manual.celula = false;
    }
  }

  // ========== CARGAS ==========
  cargarFlujos(): void {
    this.flujoValorService.getFlujos().subscribe({
      next: (data: any[]) => {
        this.flujos = data || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error al cargar flujos:', err);
        this.error = 'Error al cargar flujos: ' + (err.error?.message || err.statusText);
        this.cdr.detectChanges();
      }
    });
  }

  cargarTipologias(): void {
    this.flujoValorService.getTipologias().subscribe({
      next: (data: string[]) => {
        this.tipologias = data || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error al cargar tipologías:', err);
      }
    });
  }

  cargarTodosLosLideres(): void {
    this.flujoValorService.getFlujos().subscribe({
      next: (data: any[]) => {
        const rows = data || [];
        this.lideresTecnicosFV = [...new Set(rows.map(f => f?.liderTecnicoFlujoValor).filter(Boolean))];
        this.scrumMasters = [...new Set(rows.map(f => f?.scrum).filter(Boolean))];
        this.productOwners = [...new Set(rows.map(f => f?.po).filter(Boolean))];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error al cargar líderes:', err);
      }
    });
  }

  // ========== SELECT HANDLERS ==========
  onSelectTipologia(): void {
    this.resetManualFlags('tipologia');
    this.onTipologiaChange();
  }

  onSelectGerente(): void {
    this.resetManualFlags('gerente');
    this.onGerenteChange();
  }

  onSelectFlujo(): void {
    this.resetManualFlags('flujo');
    this.onFlujoChange();
  }

  onSelectCelula(): void {
    this.resetManualFlags('celula');
    this.onCelulaChange();
  }

  // ========== CAMBIOS ==========
  onTipologiaChange(): void {
    this.nuevoFlujo.gerente = '';
    this.nuevoFlujo.flujodeValor = '';
    this.nuevoFlujo.celula = '';
    this.gerentes = [];
    this.flujosFiltrados = [];
    this.celulasFiltradas = [];
    this.creandoNuevo = {};

    if (this.manual.tipologia) {
      this.cdr.detectChanges();
      return;
    }

    if (this.nuevoFlujo.tipologia && !this.creandoNuevo['tipologia']) {
      this.flujoValorService.getGerentesPorTipologia(this.nuevoFlujo.tipologia).subscribe({
        next: (data: string[]) => {
          this.gerentes = data || [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('❌ Error al cargar gerentes:', err)
      });
    }
  }

  onGerenteChange(): void {
    this.nuevoFlujo.flujodeValor = '';
    this.nuevoFlujo.celula = '';
    this.flujosFiltrados = [];
    this.celulasFiltradas = [];
    this.creandoNuevo['flujo'] = false;
    this.creandoNuevo['celula'] = false;

    if (this.manual.gerente) {
      this.cdr.detectChanges();
      return;
    }

    if (this.nuevoFlujo.gerente && !this.creandoNuevo['gerente']) {
      this.flujoValorService.getFlujosPorGerente(this.nuevoFlujo.gerente).subscribe({
        next: (data: string[]) => {
          this.flujosFiltrados = data || [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('❌ Error al cargar flujos:', err)
      });
    }
  }

  onFlujoChange(): void {
    this.nuevoFlujo.celula = '';
    this.celulasFiltradas = [];
    this.creandoNuevo['celula'] = false;

    if (this.manual.flujo) {
      this.cdr.detectChanges();
      return;
    }

    if (this.nuevoFlujo.flujodeValor && !this.creandoNuevo['flujo']) {
      this.flujoValorService.getCelulasPorFlujo(this.nuevoFlujo.flujodeValor).subscribe({
        next: (data: string[]) => {
          this.celulasFiltradas = data || [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('❌ Error al cargar células:', err)
      });
    }
  }

  onCelulaChange(): void {
    if (this.manual.celula) {
      this.cdr.detectChanges();
      return;
    }
    // Sin líderes por célula en esta vista.
    this.cdr.detectChanges();
  }

  // ========== CREAR NUEVO ==========
  iniciarCrear(campo: string): void {
    this.creandoNuevo[campo] = true;
    this.nuevoValorInput[campo] = '';
    this.cdr.detectChanges();
  }

  guardarNuevoValor(campo: string): void {
    const valor = this.nuevoValorInput[campo]?.trim();

    if (!valor) {
      this.error = 'El campo no puede estar vacío';
      this.cdr.detectChanges();
      return;
    }

    switch (campo) {
      case 'tipologia':
        this.nuevoFlujo.tipologia = valor;
        this.tipologias = this.addUnique(this.tipologias, valor);
        this.manual.tipologia = true;
        this.creandoNuevo[campo] = false;
        break;

      case 'gerente':
        this.nuevoFlujo.gerente = valor;
        this.gerentes = this.addUnique(this.gerentes, valor);
        this.manual.gerente = true;
        this.creandoNuevo[campo] = false;
        break;

      case 'flujo':
        this.nuevoFlujo.flujodeValor = valor;
        this.flujosFiltrados = this.addUnique(this.flujosFiltrados, valor);
        this.manual.flujo = true;
        this.creandoNuevo[campo] = false;
        break;

      case 'celula':
        this.nuevoFlujo.celula = valor;
        this.celulasFiltradas = this.addUnique(this.celulasFiltradas, valor);
        this.manual.celula = true;
        this.creandoNuevo[campo] = false;
        break;

      case 'liderTecnicoFlujoValor':
        this.nuevoFlujo.liderTecnicoFlujoValor = valor;
        this.lideresTecnicosFV = this.addUnique(this.lideresTecnicosFV, valor);
        this.creandoNuevo[campo] = false;
        break;

      case 'scrum':
        this.nuevoFlujo.scrum = valor;
        this.scrumMasters = this.addUnique(this.scrumMasters, valor);
        this.creandoNuevo[campo] = false;
        break;

      case 'po':
        this.nuevoFlujo.po = valor;
        this.productOwners = this.addUnique(this.productOwners, valor);
        this.creandoNuevo[campo] = false;
        break;
    }

    this.nuevoValorInput[campo] = '';
    this.cdr.detectChanges();
  }

  cancelarCrear(campo: string): void {
    this.creandoNuevo[campo] = false;
    this.nuevoValorInput[campo] = '';
    this.cdr.detectChanges();
  }

  // ========== EDITAR ==========
  iniciarEdicion(flujo: any): void {
    this.flujoEnEdicion = { ...flujo };

    this.nuevoFlujo = {
      tipologia: flujo?.tipologia || '',
      gerente: flujo?.gerente || '',
      flujodeValor: flujo?.flujodeValor || '',
      celula: flujo?.celula || '',
      liderTecnicoFlujoValor: flujo?.liderTecnicoFlujoValor || '',
      scrum: flujo?.scrum || '',
      po: flujo?.po || ''
    };

    this.manual = { tipologia: false, gerente: false, flujo: false, celula: false };

    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.creandoNuevo = {};

    if (this.nuevoFlujo.tipologia) {
      this.flujoValorService.getGerentesPorTipologia(this.nuevoFlujo.tipologia).subscribe({
        next: (data: string[]) => {
          this.gerentes = data || [];
          this.cdr.detectChanges();
        }
      });

      if (this.nuevoFlujo.gerente) {
        this.flujoValorService.getFlujosPorGerente(this.nuevoFlujo.gerente).subscribe({
          next: (data: string[]) => {
            this.flujosFiltrados = data || [];
            this.cdr.detectChanges();
          }
        });

        if (this.nuevoFlujo.flujodeValor) {
          this.flujoValorService.getCelulasPorFlujo(this.nuevoFlujo.flujodeValor).subscribe({
            next: (data: string[]) => {
              this.celulasFiltradas = data || [];
              this.cdr.detectChanges();
            }
          });
        }
      }
    }

    this.cdr.detectChanges();

    setTimeout(() => {
      document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  cancelarEdicion(): void {
    this.flujoEnEdicion = null;

    this.nuevoFlujo = {
      tipologia: '',
      gerente: '',
      flujodeValor: '',
      celula: '',
      liderTecnicoFlujoValor: '',
      scrum: '',
      po: ''
    };

    this.manual = { tipologia: false, gerente: false, flujo: false, celula: false };

    this.gerentes = [];
    this.flujosFiltrados = [];
    this.celulasFiltradas = [];
    this.creandoNuevo = {};
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();
  }

  guardarEdicion(): void {
    if (!this.nuevoFlujo.tipologia || !this.nuevoFlujo.gerente || !this.nuevoFlujo.flujodeValor || !this.nuevoFlujo.celula) {
      this.error = 'Tipología, Gerente, Flujo de Valor y Célula son requeridos';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();

    const payload = {
      tipologia: this.nuevoFlujo.tipologia,
      gerente: this.nuevoFlujo.gerente,
      flujodeValor: this.nuevoFlujo.flujodeValor,
      celula: this.nuevoFlujo.celula,
      liderTecnicoFlujoValor: this.nuevoFlujo.liderTecnicoFlujoValor,
      scrum: this.nuevoFlujo.scrum,
      po: this.nuevoFlujo.po
    };

    this.flujoValorService.actualizarFlujo(this.flujoEnEdicion._id, payload).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = '✅ Flujo modificado correctamente';

        this.flujoEnEdicion = null;
        this.cancelarEdicion();

        setTimeout(() => {
          this.cargarFlujos();
          this.cargarTipologias();
          this.cargarTodosLosLideres();
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorHTML = err.error?.error || ('Error al guardar flujo: ' + err.statusText);
        this.cdr.detectChanges();
      }
    });
  }

  agregarFlujo(): void {
    if (!this.nuevoFlujo.tipologia || !this.nuevoFlujo.gerente || !this.nuevoFlujo.flujodeValor || !this.nuevoFlujo.celula) {
      this.error = 'Tipología, Gerente, Flujo de Valor y Célula son requeridos';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.errorHTML = '';
    this.mensaje = '';
    this.cdr.detectChanges();

    const payload = {
      tipologia: this.nuevoFlujo.tipologia,
      gerente: this.nuevoFlujo.gerente,
      flujodeValor: this.nuevoFlujo.flujodeValor,
      celula: this.nuevoFlujo.celula,
      liderTecnicoFlujoValor: this.nuevoFlujo.liderTecnicoFlujoValor,
      scrum: this.nuevoFlujo.scrum,
      po: this.nuevoFlujo.po
    };

    this.flujoValorService.agregarFlujo(payload).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = '✅ Flujo agregado correctamente';

        this.nuevoFlujo = {
          tipologia: '',
          gerente: '',
          flujodeValor: '',
          celula: '',
          liderTecnicoFlujoValor: '',
          scrum: '',
          po: ''
        };

        this.manual = { tipologia: false, gerente: false, flujo: false, celula: false };

        this.gerentes = [];
        this.flujosFiltrados = [];
        this.celulasFiltradas = [];
        this.creandoNuevo = {};
        this.error = '';
        this.errorHTML = '';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.cargarFlujos();
          this.cargarTipologias();
          this.cargarTodosLosLideres();
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorHTML = err.error?.error || ('Error al agregar flujo: ' + err.statusText);
        this.cdr.detectChanges();
      }
    });
  }

  eliminarFlujo(id: string, index: number): void {
    // Sin popup de confirmación
    this.loading = true;
    this.error = '';
    this.errorHTML = '';
    this.cdr.detectChanges();

    this.flujoValorService.eliminarFlujo(id).subscribe({
      next: () => {
        this.loading = false;
        this.flujos.splice(index, 1);
        this.mensaje = '✅ Flujo eliminado correctamente';
        this.error = '';
        this.errorHTML = '';

        setTimeout(() => {
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 1500);

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorHTML = err.error?.error || ('Error al eliminar flujo: ' + err.statusText);
        this.cdr.detectChanges();
      }
    });
  }
}