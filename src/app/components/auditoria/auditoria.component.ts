import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaService } from '../../services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {
  registros: any[] = [];
  cargando = true;
  error: string | null = null;

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit() {
    this.cargarAuditoria();
  }

  cargarAuditoria() {
    this.auditoriaService.getAuditoria().subscribe({
      next: (data) => {
        this.registros = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error cargando auditoría';
        this.cargando = false;
      }
    });
  }

  exportar() {
    this.auditoriaService.exportarExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `auditoria_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
      }
    });
  }
}