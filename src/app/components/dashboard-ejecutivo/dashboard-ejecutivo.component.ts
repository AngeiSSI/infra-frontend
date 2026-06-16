import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-ejecutivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-ejecutivo.component.html',
  styleUrls: ['./dashboard-ejecutivo.component.css']
})
export class DashboardEjecutivoComponent implements OnInit {
  dashboard: any = {};
  cargando = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    console.log('📊 Dashboard Ejecutivo iniciando...');
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.dashboardService.getDashboardEjecutivo().subscribe({
      next: (data) => {
        console.log('✅ Dashboard cargado:', data);
        this.dashboard = data.kpis || data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error cargando dashboard:', err);
        this.error = 'Error cargando el dashboard';
        this.cargando = false;
      }
    });
  }
}