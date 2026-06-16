import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

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

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.dashboardService.getDashboardEjecutivo().subscribe({
      next: (data) => {
        this.dashboard = data.kpis;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.cargando = false;
      }
    });
  }
}