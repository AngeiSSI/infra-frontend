import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-ttm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-ttm.component.html',
  styleUrls: ['./dashboard-ttm.component.css']
})
export class DashboardTTMComponent implements OnInit {
  ttm: any = {};
  cargando = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    console.log('⏱ Dashboard TTM iniciando...');
    this.cargarTTM();
  }

  cargarTTM() {
    this.dashboardService.getDashboardTTM().subscribe({
      next: (data) => {
        console.log('✅ TTM cargado:', data);
        this.ttm = data.ttm || data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error cargando TTM:', err);
        this.error = 'Error cargando el dashboard TTM';
        this.cargando = false;
      }
    });
  }
}