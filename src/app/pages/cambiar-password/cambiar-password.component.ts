import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cambiar-password-container">
      <div class="card">
        <h1>🔐 Cambiar Contraseña</h1>
        <p class="subtitle">Es tu primer acceso. Por favor, cambia tu contraseña.</p>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div *ngIf="mensaje" class="alert alert-success">
          {{ mensaje }}
        </div>

        <div class="form-group">
          <label>Nueva Contraseña</label>
          <input 
            type="password" 
            [(ngModel)]="nueva_password"
            placeholder="Mínimo 6 caracteres"
            [disabled]="loading"
          />
        </div>

        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input 
            type="password" 
            [(ngModel)]="confirmar_password"
            placeholder="Confirma tu contraseña"
            [disabled]="loading"
          />
        </div>

        <button 
          class="btn btn-success"
          (click)="cambiarPassword()"
          [disabled]="loading"
        >
          {{ loading ? '⏳ Guardando...' : '✅ Cambiar Contraseña' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cambiar-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      width: 100%;
      max-width: 400px;
    }

    h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.8rem;
      text-align: center;
    }

    .subtitle {
      color: #999;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
      margin-top: 1rem;
    }

    .btn-success {
      background: #4caf50;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-success:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-danger {
      background: #ffebee;
      color: #d32f2f;
      border-left: 4px solid #d32f2f;
    }

    .alert-success {
      background: #e8f5e9;
      color: #388e3c;
      border-left: 4px solid #388e3c;
    }
  `]
})
export class CambiarPasswordComponent implements OnInit {
  nueva_password = '';
  confirmar_password = '';
  loading = false;
  error = '';
  mensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si no es primera vez, redirigir a actividades
    if (!this.authService.isPrimeraVez()) {
      console.log('ℹ️ [CAMBIAR PASSWORD] Usuario ya cambió contraseña, redirigiendo');
      this.router.navigate(['/actividades']);
    }
  }

  cambiarPassword(): void {
    this.error = '';

    if (!this.nueva_password.trim()) {
      this.error = '❌ La contraseña es requerida';
      return;
    }

    if (this.nueva_password.length < 6) {
      this.error = '❌ La contraseña debe tener mínimo 6 caracteres';
      return;
    }

    if (this.nueva_password !== this.confirmar_password) {
      this.error = '❌ Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    console.log('🔐 [CAMBIAR PASSWORD] Enviando nueva contraseña');

    this.authService.cambiarPasswordPrimeraVez(this.nueva_password).subscribe({
      next: (response) => {
        console.log('✅ [CAMBIAR PASSWORD] Contraseña cambiada:', response);
        this.loading = false;
        this.mensaje = '✅ Contraseña cambiada correctamente';
        
        setTimeout(() => {
          console.log('📊 [CAMBIAR PASSWORD] Redirigiendo a actividades');
          this.router.navigate(['/actividades']);
        }, 1500);
      },
      error: (err) => {
        console.error('❌ [CAMBIAR PASSWORD] Error:', err);
        this.loading = false;
        this.error = '❌ Error al cambiar contraseña: ' + (err.error?.message || err.statusText);
      }
    });
  }
}