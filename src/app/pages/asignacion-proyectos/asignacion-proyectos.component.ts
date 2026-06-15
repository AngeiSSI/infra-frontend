import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { AuthService } from '../../services/auth.service';
import { ActividadesService, Catalogo, Usuario } from '../../services/actividades.service';
import { ListasMaestrasService, ListaMaestraItem } from '../../services/listas-maestras.service';
import {
  AsignacionProyectosService,
  ProyectoActividadPlanificada,
  ProyectoAsignacionPayload,
  ProyectoAsignacionGuardado
} from '../../services/asignacion-proyectos.service';
import { AsignacionService, Asignacion } from '../../services/asignacion.service';
import { FestivosService } from '../../services/festivos.service';
import { MacroTareasService, MacroTarea } from '../../services/macro-tareas.service';

type TabAsignacionProyectos = 'nueva' | 'borradores' | 'historico';

@Component({
  selector: 'app-asignacion-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignacion-proyectos.html',
  styles: [`
    .page-wrapper {
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(204, 0, 0, 0.06), transparent 25%),
        linear-gradient(180deg, #f7f8fb 0%, #f2f4f8 100%);
      padding: 1.5rem;
    }

    .page-shell {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .hero {
      background: linear-gradient(135deg, #b30000 0%, #d32f2f 55%, #ef5350 100%);
      color: white;
      border-radius: 18px;
      padding: 2rem;
      box-shadow: 0 18px 45px rgba(179, 0, 0, 0.20);
      position: relative;
      overflow: hidden;
    }

    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 90% 10%, rgba(255,255,255,0.20), transparent 20%),
        radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12), transparent 22%);
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .hero-title h1 {
      margin: 0 0 .4rem 0;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -.02em;
    }

    .hero-title p {
      margin: 0;
      opacity: .92;
      font-size: 1rem;
      max-width: 760px;
      line-height: 1.5;
    }

    .hero-badge {
      background: rgba(255,255,255,0.16);
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 14px;
      padding: .9rem 1.1rem;
      min-width: 260px;
      backdrop-filter: blur(4px);
    }

    .hero-badge .label {
      font-size: .8rem;
      text-transform: uppercase;
      letter-spacing: .08em;
      opacity: .85;
      margin-bottom: .35rem;
    }

    .hero-badge .value {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .tab-bullets {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      background: white;
      border-radius: 18px;
      padding: 1rem 1.2rem;
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
      border: 1px solid #edf1f5;
    }

    .tab-bullet {
      display: inline-flex;
      align-items: center;
      gap: .6rem;
      padding: .8rem 1rem;
      border-radius: 999px;
      border: 1px solid #e2e8f0;
      background: #fff;
      cursor: pointer;
      font-weight: 700;
      color: #475569;
      transition: all .2s ease;
      user-select: none;
    }

    .tab-bullet:hover {
      transform: translateY(-1px);
      background: #fafafa;
    }

    .tab-bullet.active {
      background: #fff1f1;
      color: #b71c1c;
      border-color: #f3c7c7;
      box-shadow: 0 8px 20px rgba(183, 28, 28, 0.10);
    }

    .tab-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #cbd5e1;
      display: inline-block;
    }

    .tab-bullet.active .tab-dot {
      background: #d32f2f;
      box-shadow: 0 0 0 4px rgba(211, 47, 47, 0.12);
    }

    .alert {
      padding: 1rem 1.1rem;
      border-radius: 12px;
      border-left: 5px solid;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    }

    .alert-danger {
      background: #ffebee;
      color: #b71c1c;
      border-left-color: #d32f2f;
    }

    .alert-warning {
      background: #fff8e1;
      color: #8a5300;
      border-left-color: #f9a825;
    }

    .alert-success {
      background: #e8f5e9;
      color: #1b5e20;
      border-left-color: #43a047;
    }

    .panel {
      background: white;
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
      border: 1px solid #edf1f5;
      overflow: hidden;
    }

    .panel-header {
      padding: 1.2rem 1.4rem;
      border-bottom: 1px solid #eef1f5;
      background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
    }

    .panel-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .panel-title {
      margin: 0;
      font-size: 1.15rem;
      color: #b71c1c;
      font-weight: 800;
    }

    .panel-subtitle {
      margin: .35rem 0 0 0;
      color: #6b7280;
      font-size: .92rem;
    }

    .panel-body {
      padding: 1.4rem;
    }

    .section-block {
      margin-bottom: 1.5rem;
    }

    .section-block:last-child {
      margin-bottom: 0;
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: .7rem;
      margin-bottom: 1rem;
    }

    .section-icon {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #fdecec;
      color: #b71c1c;
      font-size: 1rem;
    }

    .section-heading h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 800;
      color: #1f2937;
    }

    .section-heading p {
      margin: .15rem 0 0 0;
      color: #6b7280;
      font-size: .88rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: .45rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: .92rem;
      color: #374151;
      font-weight: 700;
    }

    input, select, textarea {
      width: 100%;
      padding: .85rem .95rem;
      border: 1.5px solid #dde3ea;
      border-radius: 12px;
      font-size: .95rem;
      background: #fff;
      transition: all .25s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #d32f2f;
      box-shadow: 0 0 0 4px rgba(211, 47, 47, 0.10);
      transform: translateY(-1px);
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    .pill-info {
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      padding: .45rem .8rem;
      border-radius: 999px;
      background: #fff3f3;
      color: #b71c1c;
      font-size: .82rem;
      font-weight: 700;
      border: 1px solid #ffd8d8;
    }

    .add-activity-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.3fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .tabla-shell {
      border: 1px solid #edf1f5;
      border-radius: 16px;
      overflow: hidden;
      background: #fff;
    }

    .tabla-wrapper {
      overflow-x: auto;
    }

    .tabla {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    .tabla thead {
      background: linear-gradient(90deg, #23272f 0%, #343a46 100%);
    }

    .tabla th {
      color: white;
      font-size: .83rem;
      text-transform: uppercase;
      letter-spacing: .05em;
      padding: 1rem .9rem;
      text-align: left;
      font-weight: 700;
      white-space: nowrap;
    }

    .tabla td {
      border-bottom: 1px solid #eef1f5;
      padding: 1rem .9rem;
      vertical-align: top;
      color: #1f2937;
      font-size: .94rem;
    }

    .tabla tbody tr:hover {
      background: #fafbfc;
    }

    .activity-cell {
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }

    .activity-name {
      font-weight: 700;
      color: #111827;
    }

    .activity-meta {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      padding: .28rem .6rem;
      border-radius: 999px;
      background: #fdecec;
      color: #b71c1c;
      font-size: .76rem;
      font-weight: 700;
    }

    .date-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 108px;
      padding: .42rem .7rem;
      border-radius: 10px;
      background: #f5f7fa;
      color: #374151;
      font-weight: 700;
      font-size: .84rem;
      border: 1px solid #e5eaf0;
    }

    .days-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: .45rem .75rem;
      border-radius: 10px;
      background: #fff3e0;
      color: #ef6c00;
      font-weight: 800;
      font-size: .82rem;
      border: 1px solid #ffe0b2;
    }

    .action-btn {
      border: none;
      border-radius: 10px;
      padding: .55rem .85rem;
      font-weight: 700;
      cursor: pointer;
      font-size: .82rem;
      transition: all .2s ease;
      margin-right: .5rem;
      margin-bottom: .4rem;
    }

    .action-btn.delete {
      background: #ffebee;
      color: #c62828;
    }

    .action-btn.delete:hover {
      background: #ffcdd2;
      transform: translateY(-1px);
    }

    .action-btn.primary {
      background: #e3f2fd;
      color: #1565c0;
    }

    .action-btn.primary:hover {
      background: #d3ebff;
    }

    .action-btn.success {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .action-btn.success:hover {
      background: #dff2e2;
    }

    .empty-activities {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      background: linear-gradient(180deg, #fff 0%, #fbfcfd 100%);
    }

    .gantt-card {
      background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
      border: 1px solid #edf1f5;
      border-radius: 16px;
      padding: 1.2rem;
    }

    .gantt-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .gantt-row {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1rem;
      align-items: center;
    }

    .gantt-label {
      display: flex;
      flex-direction: column;
      gap: .35rem;
      background: #fafbfc;
      border: 1px solid #edf1f5;
      border-radius: 14px;
      padding: .9rem;
    }

    .gantt-label strong {
      color: #1f2937;
      font-size: .95rem;
    }

    .gantt-label span {
      color: #6b7280;
      font-size: .85rem;
    }

    .gantt-bar-wrap {
      position: relative;
      height: 34px;
      border-radius: 999px;
      background:
        repeating-linear-gradient(
          90deg,
          #f4f6f8 0px,
          #f4f6f8 40px,
          #eef1f5 40px,
          #eef1f5 41px
        );
      border: 1px solid #e5eaf0;
      overflow: hidden;
    }

    .gantt-bar {
      position: absolute;
      top: 4px;
      height: 24px;
      border-radius: 999px;
      background: linear-gradient(90deg, #b71c1c 0%, #d32f2f 60%, #ef5350 100%);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .78rem;
      font-weight: 700;
      box-shadow: 0 8px 18px rgba(211, 47, 47, 0.22);
      padding: 0 .7rem;
      white-space: nowrap;
    }

    .actions-panel {
      position: sticky;
      bottom: 0;
      z-index: 5;
      background: rgba(247, 248, 251, 0.92);
      backdrop-filter: blur(8px);
      border: 1px solid #eaeef3;
      border-radius: 18px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
      padding: 1rem 1.2rem;
    }

    .actions-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .actions-info {
      display: flex;
      flex-direction: column;
      gap: .25rem;
    }

    .actions-info .title {
      font-weight: 800;
      color: #111827;
    }

    .actions-info .text {
      color: #6b7280;
      font-size: .9rem;
    }

    .btn-row {
      display: flex;
      gap: .85rem;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary,
    .btn-success {
      border: none;
      border-radius: 12px;
      padding: .85rem 1.15rem;
      font-weight: 800;
      cursor: pointer;
      transition: all .22s ease;
      font-size: .92rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #b71c1c, #d32f2f);
      color: white;
      box-shadow: 0 10px 24px rgba(183, 28, 28, 0.22);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #dce3ea;
    }

    .btn-secondary:hover {
      background: #f8fafc;
    }

    .btn-success {
      background: linear-gradient(135deg, #2e7d32, #43a047);
      color: white;
      box-shadow: 0 10px 24px rgba(67, 160, 71, 0.18);
    }

    .btn-success:hover {
      transform: translateY(-1px);
    }

    .btn-success:disabled,
    .btn-primary:disabled,
    .btn-secondary:disabled {
      opacity: .65;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .pdf-render-host {
      position: absolute;
      left: -99999px;
      top: 0;
      width: 1000px;
      opacity: 0;
      pointer-events: none;
    }

    .pdf-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .pdf-print-layout {
      background: white;
    }

    .pdf-sheet {
      background: white;
      color: #111;
      padding: 18px;
      border: 2px solid #cfcfcf;
      border-radius: 8px;
    }

    .pdf-title {
      text-align: center;
      font-weight: 800;
      font-size: 18px;
      color: #b71c1c;
      margin-bottom: 14px;
      padding: 10px;
      border: 2px solid #b71c1c;
      background: #fff5f5;
    }

    .pdf-section-title {
      margin-top: 16px;
      margin-bottom: 8px;
      background: #c00000;
      color: white;
      font-weight: 800;
      text-align: center;
      padding: 8px 10px;
      font-size: 13px;
      border-radius: 4px;
    }

    .pdf-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin-bottom: 10px;
      font-size: 11px;
    }

    .pdf-table th,
    .pdf-table td {
      border: 1px solid #777;
      padding: 7px 8px;
      vertical-align: middle;
      word-wrap: break-word;
    }

    .pdf-table th {
      background: #e6e6e6;
      font-weight: 700;
      text-align: left;
    }

    .pdf-contexto {
      min-height: 70px;
      white-space: pre-wrap;
    }

    .pdf-header-table th {
      width: 20%;
    }

    .pdf-summary-table th {
      width: 25%;
      background: #f0f0f0;
    }

    .pdf-activities-table thead th {
      background: #333;
      color: white;
      text-align: center;
      font-size: 10.5px;
    }

    .pdf-activities-table tbody td {
      font-size: 10.5px;
    }

    .pdf-gantt-box {
      border: 1px solid #999;
      padding: 10px;
      background: #fafafa;
      overflow: hidden;
    }

    .pdf-gantt-row {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }

    .pdf-gantt-label {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 10px;
      padding: 6px 8px;
      background: #f2f2f2;
      border: 1px solid #ccc;
      min-width: 0;
    }

    .pdf-gantt-track {
      position: relative;
      height: 24px;
      width: 520px;
      max-width: 520px;
      background:
        repeating-linear-gradient(
          90deg,
          #f1f1f1 0px,
          #f1f1f1 26px,
          #e1e1e1 26px,
          #e1e1e1 27px
        );
      border: 1px solid #ccc;
      overflow: hidden;
    }

    .pdf-gantt-bar {
      position: absolute;
      top: 3px;
      height: 16px;
      background: #c00000;
      color: white;
      font-size: 9px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      white-space: nowrap;
      border-radius: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 1100px) {
      .add-activity-grid {
        grid-template-columns: 1fr 1fr;
      }

      .gantt-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-wrapper {
        padding: 1rem;
      }

      .hero {
        padding: 1.4rem;
      }

      .hero-title h1 {
        font-size: 1.6rem;
      }

      .add-activity-grid,
      .form-grid {
        grid-template-columns: 1fr;
      }

      .actions-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-row {
        width: 100%;
      }

      .btn-row button {
        flex: 1 1 100%;
      }

      .tab-bullets {
        flex-direction: column;
      }
    }
  `]
})
export class AsignacionProyectosComponent implements OnInit {
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  usuario: any = null;
  loading = false;
  error = '';
  exito = '';
  advertencia = '';

  usuarios: Usuario[] = [];
  catalogo: Catalogo[] = [];
  macroTareas: MacroTarea[] = [];
  festivos: any[] = [];

  readonly ganttDayWidth = 18;
  readonly pdfGanttTrackWidth = 520;
  readonly pdfGanttMinBarWidth = 36;

  gerentes: ListaMaestraItem[] = [];
  lideresTecnicos: ListaMaestraItem[] = [];
  scrums: ListaMaestraItem[] = [];
  pos: ListaMaestraItem[] = [];
  flujosValor: ListaMaestraItem[] = [];
  celulas: ListaMaestraItem[] = [];
  arquitectos: ListaMaestraItem[] = [];
  lideresTecnicosFV: ListaMaestraItem[] = [];
  lideresInfraestructuraFV: ListaMaestraItem[] = [];

  borradores: ProyectoAsignacionGuardado[] = [];
  historico: ProyectoAsignacionGuardado[] = [];

  proyectoEnEdicionId: string | null = null;
  modoEdicion = false;
  tabActiva: TabAsignacionProyectos = 'nueva';

  proyecto = {
    nombreProyecto: '',
    liderInfraestructura: '',
    liderInfraestructuraFV: '',
    gerenteSolicitante: '',
    liderTecnico: '',
    scrum: '',
    po: '',
    flujoValor: '',
    celula: '',
    arquitecto: '',
    fechaSolicitud: new Date().toISOString().split('T')[0],
    contexto: '',
    idFeature: '',
    pep: '',
    tipoProyecto: '',
    faseProyecto: '',
    porcentajeAsignacion: 100
  };

  actividadNueva = {
    macroTareaId: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    dependenciaIdLocal: '',
    observaciones: ''
  };

  actividadesProyecto: ProyectoActividadPlanificada[] = [];

  tiposProyecto: string[] = ['Flujo de valor', 'Proyecto transversal', 'Evolutivo', 'Mantenimiento'];
  fasesProyecto: string[] = ['Inicio', 'Planeación', 'Ejecución', 'Cierre'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private actividadesService: ActividadesService,
    private listasMaestrasService: ListasMaestrasService,
    private asignacionProyectosService: AsignacionProyectosService,
    private asignacionService: AsignacionService,
    private festivosService: FestivosService,
    private macroTareasService: MacroTareasService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();

    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.puedeAcceder()) {
      this.router.navigate(['/actividades']);
      return;
    }

    // ✅ CARGAR MACRO TAREAS INMEDIATAMENTE
    this.cargarMacroTareasInmediato();
    this.cargarCombos();
    this.cargarFestivos();
    this.cargarBorradores();
    this.cargarHistorico();
  }

  cambiarTab(tab: TabAsignacionProyectos): void {
    this.tabActiva = tab;
  }

  puedeAcceder(): boolean {
    const rol = this.usuario?.rol?.toLowerCase();
    return rol === 'senior' || rol === 'coordinador' || rol === 'administrador' || rol === 'super_admin';
  }

  cargarMacroTareasInmediato(): void {
    console.log('Cargando macro tareas inmediatamente...');
    this.macroTareasService.obtenerMacroTareas().subscribe({
      next: (macroTareas) => {
        console.log('Macro tareas cargadas:', macroTareas.length);
        this.macroTareas = macroTareas;
      },
      error: (err) => {
        console.error('Error al cargar macro tareas:', err);
        this.macroTareas = [];
      }
    });
  }

  cargarCombos(): void {
    this.actividadesService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.filter(u => u.activo !== false);
      }
    });

    this.gerentes = this.listasMaestrasService.obtenerPorTipo('gerente').filter(x => x.activo);
    this.lideresInfraestructuraFV = this.listasMaestrasService.obtenerPorTipo('lider_infraestructura_fv').filter(x => x.activo);
    this.lideresTecnicos = this.listasMaestrasService.obtenerPorTipo('lider_tecnico').filter(x => x.activo);
    this.lideresTecnicosFV = this.listasMaestrasService.obtenerPorTipo('lider_tecnico_flujo_valor').filter(x => x.activo);
    this.scrums = this.listasMaestrasService.obtenerPorTipo('scrum').filter(x => x.activo);
    this.pos = this.listasMaestrasService.obtenerPorTipo('po').filter(x => x.activo);
    this.flujosValor = this.listasMaestrasService.obtenerPorTipo('flujo_valor').filter(x => x.activo);
    this.celulas = this.listasMaestrasService.obtenerPorTipo('celula').filter(x => x.activo);
    this.arquitectos = this.listasMaestrasService.obtenerPorTipo('arquitecto').filter(x => x.activo);
  }

  cargarFestivos(): void {
    this.festivosService.getFestivos().subscribe({
      next: (data: any[]) => {
        this.festivos = Array.isArray(data) ? data : [];
      },
      error: () => {
        this.festivos = [];
      }
    });
  }

  cargarBorradores(): void {
    this.asignacionProyectosService.obtenerBorradores().subscribe({
      next: (data) => {
        this.borradores = data;
      }
    });
  }

  cargarHistorico(): void {
    this.asignacionProyectosService.obtenerHistorico().subscribe({
      next: (data) => {
        this.historico = data;
      }
    });
  }

  get lideresInfraestructura(): Usuario[] {
    return this.usuarios.filter(u => {
      const rol = (u.rol || '').toLowerCase();
      return rol.includes('senior') || rol.includes('lider');
    });
  }

  get opcionesDependencia(): ProyectoActividadPlanificada[] {
    return this.actividadesProyecto;
  }

  get resumenFechaInicio(): string {
    if (this.actividadesProyecto.length === 0) return '-';
    return [...this.actividadesProyecto]
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))[0].fechaInicio;
  }

  get resumenFechaFin(): string {
    if (this.actividadesProyecto.length === 0) return '-';
    return [...this.actividadesProyecto]
      .sort((a, b) => b.fechaFin.localeCompare(a.fechaFin))[0].fechaFin;
  }

  get totalDiasEstimados(): number {
    return this.actividadesProyecto.reduce((acc, item) => acc + (item.diasHabiles || 0), 0);
  }

  get capacidadTexto(): string {
    return `${this.proyecto.porcentajeAsignacion || 0}%`;
  }

  get totalDiasLaboralesProyecto(): number {
    if (!this.resumenFechaInicio || this.resumenFechaInicio === '-' || !this.resumenFechaFin || this.resumenFechaFin === '-') {
      return 1;
    }

    const total = this.contarDiasLaboralesIncluyendoFin(this.resumenFechaInicio, this.resumenFechaFin);
    return Math.max(1, total);
  }

  obtenerNombreDependencia(dependenciaIdLocal?: string): string {
    if (!dependenciaIdLocal) {
      return '-';
    }

    const dependencia = this.actividadesProyecto.find(a => a.idLocal === dependenciaIdLocal);
    return dependencia?.actividad || '-';
  }

  construirPayload(): ProyectoAsignacionPayload {
    return {
      ...this.proyecto,
      actividades: this.actividadesProyecto
    };
  }

  cargarProyectoGuardado(item: ProyectoAsignacionGuardado): void {
    this.proyectoEnEdicionId = item.id;
    this.modoEdicion = true;
    this.tabActiva = 'nueva';

    this.proyecto = {
      nombreProyecto: item.nombreProyecto || '',
      liderInfraestructura: item.liderInfraestructura || '',
      liderInfraestructuraFV: (item as any).liderInfraestructuraFV || '',
      gerenteSolicitante: item.gerenteSolicitante || '',
      liderTecnico: item.liderTecnico || '',
      scrum: item.scrum || '',
      po: item.po || '',
      flujoValor: item.flujoValor || '',
      celula: item.celula || '',
      arquitecto: item.arquitecto || '',
      fechaSolicitud: item.fechaSolicitud || new Date().toISOString().split('T')[0],
      contexto: item.contexto || '',
      idFeature: item.idFeature || '',
      pep: item.pep || '',
      tipoProyecto: item.tipoProyecto || '',
      faseProyecto: item.faseProyecto || '',
      porcentajeAsignacion: item.porcentajeAsignacion ?? 100
    };

    this.actividadesProyecto = Array.isArray(item.actividades)
      ? item.actividades.map(a => ({ ...a }))
      : [];

    this.actividadNueva.fechaInicio = this.proyecto.fechaSolicitud || new Date().toISOString().split('T')[0];
    this.error = '';
    this.exito = 'Proyecto cargado correctamente para continuar.';
    this.advertencia = '';
    setTimeout(() => this.exito = '', 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nuevoProyecto(): void {
    this.proyectoEnEdicionId = null;
    this.modoEdicion = false;
    this.tabActiva = 'nueva';
    this.error = '';
    this.exito = '';
    this.advertencia = '';

    this.proyecto = {
      nombreProyecto: '',
      liderInfraestructura: '',
      liderInfraestructuraFV: '',
      gerenteSolicitante: '',
      liderTecnico: '',
      scrum: '',
      po: '',
      flujoValor: '',
      celula: '',
      arquitecto: '',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      contexto: '',
      idFeature: '',
      pep: '',
      tipoProyecto: '',
      faseProyecto: '',
      porcentajeAsignacion: 100
    };

    this.actividadesProyecto = [];
    this.resetActividadNueva();
  }

  agregarActividadDesdeMacroTarea(): void {
    if (!this.actividadNueva.macroTareaId) {
      this.error = 'Selecciona una macro tarea.';
      return;
    }

    const macroSeleccionada = this.macroTareas.find(
      m => m._id === this.actividadNueva.macroTareaId
    );

    if (!macroSeleccionada) {
      this.error = 'No se encontró la macro tarea seleccionada.';
      return;
    }

    const diasTotales = this.macroTareasService.calcularDiasTotales(macroSeleccionada);

    const fechaInicioCalculada = this.obtenerFechaInicioActividad();
    const fechaFinCalculada = this.calcularFechaFinSimple(fechaInicioCalculada, diasTotales);

    const nueva: ProyectoActividadPlanificada = {
      idLocal: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      catalogoId: macroSeleccionada._id || '',
      tipificacion: 'Macro Tarea',
      actividad: macroSeleccionada.nombre,
      diasHabiles: diasTotales,
      horasMinimas: 0,
      horasMaximas: 0,
      responsable: '',
      fechaInicio: fechaInicioCalculada,
      fechaFin: fechaFinCalculada,
      dependenciaIdLocal: this.actividadNueva.dependenciaIdLocal || '',
      observaciones: this.actividadNueva.observaciones || ''
    };

    this.actividadesProyecto.push(nueva);
    this.recalcularActividades();
    this.resetActividadNueva();
    this.error = '';
  }

  eliminarActividad(idLocal: string): void {
    this.actividadesProyecto = this.actividadesProyecto.filter(a => a.idLocal !== idLocal);

    this.actividadesProyecto = this.actividadesProyecto.map(a => ({
      ...a,
      dependenciaIdLocal: a.dependenciaIdLocal === idLocal ? '' : a.dependenciaIdLocal
    }));

    this.recalcularActividades();
  }

  recalcularActividades(): void {
    this.actividadesProyecto = this.actividadesProyecto.map(item => {
      let fechaInicio = item.fechaInicio;

      if (item.dependenciaIdLocal) {
        const dependencia = this.actividadesProyecto.find(a => a.idLocal === item.dependenciaIdLocal);
        if (dependencia) {
          fechaInicio = this.siguienteDia(new Date(`${dependencia.fechaFin}T00:00:00`));
        }
      }

      const fechaFin = this.calcularFechaFinSimple(fechaInicio, item.diasHabiles);

      return {
        ...item,
        fechaInicio,
        fechaFin
      };
    });
  }

  finalizarAsignacion(): void {
    if (!this.validarProyecto()) {
      this.error = 'Completa los datos del proyecto.';
      return;
    }

    if (this.actividadesProyecto.length === 0) {
      this.error = 'Debes agregar al menos una macro tarea.';
      return;
    }

    const normalizar = (valor: any): string =>
      String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const proyectoActual = normalizar(this.proyecto.nombreProyecto);
    const featureActual = normalizar(this.proyecto.idFeature);

    const payloadAsignacion = {
      liderAsignado: this.proyecto.liderInfraestructura,
      proyecto: this.proyecto.nombreProyecto,
      idFeature: this.proyecto.idFeature,
      tipologia: this.proyecto.tipoProyecto,
      porcentajeAsignacion: this.proyecto.porcentajeAsignacion,
      liSenior: this.proyecto.liderInfraestructura,
      liderTecnico: this.proyecto.liderTecnico,
      scrum: this.proyecto.scrum,
      po: this.proyecto.po,
      liderTecnicoFV: this.proyecto.liderInfraestructuraFV,
      gerente: this.proyecto.gerenteSolicitante,
      flujoValor: this.proyecto.flujoValor,
      celula: this.proyecto.celula,
      pep: this.proyecto.pep,
      fechaAsignacion: this.proyecto.fechaSolicitud,
      fechaFinAsignacion: this.resumenFechaFin !== '-' ? this.resumenFechaFin : ''
    };

    this.loading = true;
    this.error = '';
    this.exito = '';
    this.advertencia = '';

    this.asignacionService.getAsignaciones().subscribe({
      next: (asignaciones: Asignacion[]) => {
        console.log('Asignaciones obtenidas:', asignaciones);

        const existente = asignaciones.find(item => {
          const proyectoItem = normalizar(item.proyecto);
          const featureItem = normalizar(item.idFeature);
          return proyectoItem === proyectoActual && featureItem === featureActual;
        });

        if (existente) {
          const porcentajeExistente = Number(existente.porcentajeAsignacion ?? 0);

          if (porcentajeExistente === 0) {
            if (!existente._id) {
              this.loading = false;
              this.error = 'La asignación existente no tiene identificador para actualizar.';
              return;
            }

            this.asignacionService.actualizarAsignacion(existente._id, payloadAsignacion).subscribe({
              next: () => {
                const payloadProyecto = this.construirPayload();

                this.asignacionProyectosService
                  .guardarFinalizado(payloadProyecto, this.proyectoEnEdicionId || undefined)
                  .subscribe({
                    next: () => {
                      // ✅ CREAR ACTIVIDADES DESDE ASIGNACIÓN
                      this.crearActividadesDesdeAsignacion();
                    }
                  });
              },
              error: (err) => {
                this.loading = false;
                this.error = 'Error al actualizar la asignación existente: ' + (err.error?.message || err.statusText);
              }
            });

            return;
          }

          if (porcentajeExistente >= 1) {
            this.loading = false;
            this.error = '';
            this.exito = '';
            this.advertencia = '⚠️ Proyecto existente: validar nuevo alcance.';
            alert('Proyecto existente: validar nuevo alcance.');
            return;
          }
        }

        this.asignacionService.crearAsignacion(payloadAsignacion).subscribe({
          next: () => {
            const payloadProyecto = this.construirPayload();

            this.asignacionProyectosService
              .guardarFinalizado(payloadProyecto, this.proyectoEnEdicionId || undefined)
              .subscribe({
                next: () => {
                  // ✅ CREAR ACTIVIDADES DESDE ASIGNACIÓN
                  this.crearActividadesDesdeAsignacion();
                }
              });
          },
          error: (err) => {
            this.loading = false;
            this.error = 'Error al crear la asignación: ' + (err.error?.message || err.statusText);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = 'No fue posible validar asignaciones existentes: ' + (err.error?.message || err.statusText);
      }
    });
  }

  // ✅ NUEVO MÉTODO: CREAR ACTIVIDADES AUTOMÁTICAMENTE
  crearActividadesDesdeAsignacion(): void {
    console.log('=== INICIANDO CREACIÓN DE ACTIVIDADES ===');
    console.log('Macro tareas en proyecto:', this.actividadesProyecto.length);

    let actividadesCreadas = 0;
    let actividadesEnProceso = 0;

    // ✅ CREAR ACTIVIDADES DE MACRO TAREAS
    this.actividadesProyecto.forEach((macroTarea) => {
      const macroOriginal = this.macroTareas.find(m => m._id === macroTarea.catalogoId);

      if (!macroOriginal || !macroOriginal.microTareas || macroOriginal.microTareas.length === 0) {
        console.warn('Macro tarea no encontrada o sin micro tareas:', macroTarea.catalogoId);
        return;
      }

      console.log(`\n📌 Procesando macro tarea: ${macroTarea.actividad}`);
      console.log(`   Micro tareas: ${macroOriginal.microTareas.length}`);

      let fechaActual = new Date(`${macroTarea.fechaInicio}T00:00:00`);
      let ultimaFechaFin = macroTarea.fechaInicio;

      macroOriginal.microTareas.forEach((microTarea, index) => {
        actividadesEnProceso++;

        const fechaFin = this.calcularFechaFinSimple(this.formatearFecha(fechaActual), microTarea.diasHabiles);
        ultimaFechaFin = fechaFin;

        const actividadPayload: any = {
          nombre: microTarea.actividad,
          macroTareaId: macroTarea.catalogoId,
          macroTareaNombre: macroTarea.actividad,
          lider: this.proyecto.liderInfraestructura,
          proyecto: this.proyecto.nombreProyecto,
          tipificacion: 'Micro Tarea',
          fechaInicio: this.formatearFecha(fechaActual),
          fechaFin: fechaFin,
          estado: 'pendiente',
          diasHabiles: microTarea.diasHabiles,
          horasMinimas: microTarea.horasMinimas,
          horasMaximas: microTarea.horasMaximas,
          esUltima: index === macroOriginal.microTareas!.length - 1,
          indiceSecuencia: index
        };

        console.log(`   ✅ Creando micro tarea [${index + 1}/${macroOriginal.microTareas!.length}]: ${microTarea.actividad}`);

        this.asignacionService.crearActividad(actividadPayload).subscribe({
          next: (creada) => {
            actividadesCreadas++;
            actividadesEnProceso--;
            console.log(`   ✓ Actividad creada: ${creada._id}`);

            if (actividadesEnProceso === 0) {
              this.crearCierreProyecto();
            }
          },
          error: (err) => {
            actividadesEnProceso--;
            console.error(`   ✗ Error al crear actividad: ${microTarea.actividad}`, err);
            
            if (actividadesEnProceso === 0) {
              this.crearCierreProyecto();
            }
          }
        });

        // ✅ CALCULAR FECHA INICIO PARA LA SIGUIENTE MICRO TAREA
        if (index < macroOriginal.microTareas!.length - 1) {
          fechaActual = new Date(this.siguienteDia(new Date(fechaFin)));
          console.log(`      Próxima fecha: ${this.formatearFecha(fechaActual)}`);
        }
      });
    });

    if (actividadesEnProceso === 0) {
      this.crearCierreProyecto();
    }
  }

  // ✅ NUEVO MÉTODO: CREAR ACTIVIDAD "CIERRE DE PROYECTO"
  crearCierreProyecto(): void {
    console.log('\n=== CREANDO CIERRE DE PROYECTO ===');
    console.log('Líder Infraestructura FV:', this.proyecto.liderInfraestructuraFV);

    // ✅ Calcular fechas: inicio = fecha inicio del proyecto, fin = fecha fin última macro tarea
    const fechaInicioCierre = this.resumenFechaInicio !== '-' ? this.resumenFechaInicio : this.proyecto.fechaSolicitud;
    const fechaFinCierre = this.resumenFechaFin !== '-' ? this.resumenFechaFin : this.proyecto.fechaSolicitud;

    const actividadCierre: any = {
      nombre: 'Cierre de Proyecto',
      macroTareaId: 'cierre-proyecto',
      macroTareaNombre: 'Cierre de Proyecto',
      lider: this.proyecto.liderInfraestructuraFV, // ✅ ASIGNADO AL LÍDER INFRAESTRUCTURA FV
      proyecto: this.proyecto.nombreProyecto,
      tipificacion: 'Cierre',
      actividadCatalogo: 'Cierre de Proyecto',
      fechaInicio: fechaInicioCierre,
      fechaFin: fechaFinCierre,
      estado: 'pendiente',
      diasHabiles: this.contarDiasLaboralesIncluyendoFin(fechaInicioCierre, fechaFinCierre),
      horasMinimas: 0,
      horasMaximas: 0,
      esUltima: true,
      indiceSecuencia: 999
    };

    console.log('Payload Cierre de Proyecto:', actividadCierre);

    this.asignacionService.crearActividad(actividadCierre).subscribe({
      next: (creada) => {
        console.log('✓ Cierre de Proyecto creado:', creada._id);
        this.finalizarCreacionActividades();
      },
      error: (err) => {
        console.error('✗ Error al crear Cierre de Proyecto:', err);
        this.finalizarCreacionActividades();
      }
    });
  }

  // ✅ ACTUALIZAR: Método de finalización simplificado
  finalizarCreacionActividades(): void {
    console.log(`\n=== FINALIZADO ===`);

    this.loading = false;
    this.error = '';
    this.advertencia = '';
    this.exito = `✅ Asignación finalizada. Actividades creadas automáticamente en la tabla.`;
    
    this.cargarBorradores();
    this.cargarHistorico();
    this.nuevoProyecto();
    this.tabActiva = 'historico';
    
    setTimeout(() => this.exito = '', 5000);
  }

  guardarBorrador(): void {
    if (!this.validarProyecto()) {
      this.error = 'Completa los datos principales del proyecto antes de guardar.';
      return;
    }

    const payload = this.construirPayload();

    this.asignacionProyectosService
      .guardarBorrador(payload, this.proyectoEnEdicionId || undefined)
      .subscribe({
        next: (guardado) => {
          this.proyectoEnEdicionId = guardado.id;
          this.modoEdicion = true;
          this.error = '';
          this.advertencia = '';
          this.exito = 'Borrador del proyecto guardado correctamente.';
          this.cargarBorradores();
          this.tabActiva = 'borradores';
          setTimeout(() => this.exito = '', 3000);
        },
        error: () => {
          this.error = 'No fue posible guardar el borrador.';
        }
      });
  }

  eliminarBorrador(id: string): void {
    if (!confirm('¿Deseas eliminar este borrador?')) {
      return;
    }

    this.asignacionProyectosService.eliminarBorrador(id).subscribe({
      next: () => {
        if (this.proyectoEnEdicionId === id) {
          this.nuevoProyecto();
        }
        this.advertencia = '';
        this.exito = 'Borrador eliminado correctamente.';
        this.cargarBorradores();
        setTimeout(() => this.exito = '', 3000);
      }
    });
  }

  async imprimirPDF(): Promise<void> {
    try {
      const element = this.pdfContent?.nativeElement;
      if (!element) {
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');

      const pdfWidth = 216;
      const pdfHeight = 279;
      const margin = 8;
      const usableWidth = pdfWidth - (margin * 2);
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
      heightLeft -= (pdfHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
        heightLeft -= (pdfHeight - margin * 2);
      }

      pdf.save(`asignacion-proyecto-${this.proyecto.nombreProyecto || 'sin-nombre'}.pdf`);
    } catch {
      this.error = 'No fue posible generar el PDF.';
    }
  }

  imprimirDesdeHistorico(item: ProyectoAsignacionGuardado): void {
    this.cargarProyectoGuardado(item);
    setTimeout(() => this.imprimirPDF(), 300);
  }

  obtenerFechaInicioActividad(): string {
    if (this.actividadNueva.dependenciaIdLocal) {
      const dependencia = this.actividadesProyecto.find(
        a => a.idLocal === this.actividadNueva.dependenciaIdLocal
      );

      if (dependencia) {
        return this.siguienteDia(new Date(`${dependencia.fechaFin}T00:00:00`));
      }
    }

    return this.actividadNueva.fechaInicio || this.proyecto.fechaSolicitud || new Date().toISOString().split('T')[0];
  }

  calcularFechaFinSimple(fechaInicio: string, diasHabiles: number): string {
    const fecha = new Date(`${fechaInicio}T00:00:00`);
    let restantes = Math.max(1, diasHabiles);

    while (restantes > 1) {
      fecha.setDate(fecha.getDate() + 1);
      if (!this.esDiaNoLaboral(fecha)) {
        restantes--;
      }
    }

    return this.formatearFecha(fecha);
  }

  esFinDeSemana(fecha: Date): boolean {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
  }

  esFestivo(fecha: Date): boolean {
    const objetivo = this.formatearFecha(fecha);

    return this.festivos.some((festivo: any) => {
      if (!festivo?.fecha) {
        return false;
      }

      const fechaFestivo = new Date(festivo.fecha);
      return this.formatearFecha(fechaFestivo) === objetivo;
    });
  }

  esDiaNoLaboral(fecha: Date): boolean {
    return this.esFinDeSemana(fecha) || this.esFestivo(fecha);
  }

  siguienteDia(fecha: Date): string {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + 1);

    while (this.esDiaNoLaboral(nueva)) {
      nueva.setDate(nueva.getDate() + 1);
    }

    return this.formatearFecha(nueva);
  }

  contarDiasLaboralesEntre(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T00:00:00`);

    if (fin <= inicio) {
      return 0;
    }

    const cursor = new Date(inicio);
    let dias = 0;

    while (cursor < fin) {
      if (!this.esDiaNoLaboral(cursor)) {
        dias++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return dias;
  }

  contarDiasLaboralesIncluyendoFin(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T00:00:00`);

    if (fin < inicio) {
      return 0;
    }

    const cursor = new Date(inicio);
    let dias = 0;

    while (cursor <= fin) {
      if (!this.esDiaNoLaboral(cursor)) {
        dias++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return dias;
  }

  getPdfScale(): number {
    return this.pdfGanttTrackWidth / this.totalDiasLaboralesProyecto;
  }

  getPdfMinOffset(fecha: string): number {
    if (!this.resumenFechaInicio || this.resumenFechaInicio === '-') {
      return 0;
    }

    return this.contarDiasLaboralesEntre(this.resumenFechaInicio, fecha) * this.getPdfScale();
  }

  getPdfBarWidth(dias: number): number {
    return Math.max(this.pdfGanttMinBarWidth, dias * this.getPdfScale());
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  validarProyecto(): boolean {
    return !!(
      this.proyecto.nombreProyecto.trim() &&
      this.proyecto.liderInfraestructura.trim() &&
      this.proyecto.gerenteSolicitante.trim() &&
      this.proyecto.liderTecnico.trim() &&
      this.proyecto.scrum.trim() &&
      this.proyecto.po.trim() &&
      this.proyecto.flujoValor.trim() &&
      this.proyecto.celula.trim() &&
      this.proyecto.arquitecto.trim() &&
      this.proyecto.fechaSolicitud &&
      this.proyecto.idFeature.trim() &&
      this.proyecto.tipoProyecto.trim()
    );
  }

  resetActividadNueva(): void {
    this.actividadNueva = {
      macroTareaId: '',
      fechaInicio: this.proyecto.fechaSolicitud || new Date().toISOString().split('T')[0],
      dependenciaIdLocal: '',
      observaciones: ''
    };
  }

  getMinOffset(fecha: string): number {
    if (!this.resumenFechaInicio || this.resumenFechaInicio === '-') {
      return 0;
    }

    return this.contarDiasLaboralesEntre(this.resumenFechaInicio, fecha) * this.ganttDayWidth;
  }

  getBarWidth(dias: number): number {
    return Math.max(56, dias * this.ganttDayWidth);
  }

  calcularDiasMacroTarea(macroTarea: MacroTarea): number {
    return this.macroTareasService.calcularDiasTotales(macroTarea);
  }
}