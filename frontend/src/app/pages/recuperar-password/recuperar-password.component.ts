import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="recuperar-container">
      <div class="recuperar-card">
        <h1>🔐 Recuperar Contraseña</h1>

        <!-- ALERTAS -->
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
        <div *ngIf="mensaje" class="alert alert-success">{{ mensaje }}</div>

        <!-- PASO 1: SOLICITAR EMAIL -->
        <div *ngIf="paso === 1" class="step-container">
          <p class="step-description">
            Ingresa tu email para recibir instrucciones de recuperación
          </p>
          
          <div class="form-group">
            <label for="email">📧 Email:</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              placeholder="tu@email.com"
              [disabled]="loading"
            />
          </div>

          <button
            class="btn-primary"
            (click)="solicitarRecuperacion()"
            [disabled]="loading"
          >
            {{ loading ? '⏳ Enviando...' : '✉️ Enviar Código' }}
          </button>

          <a routerLink="/login" class="link-volver">← Volver al login</a>
        </div>

        <!-- PASO 2: INGRESAR CÓDIGO Y NUEVA CONTRASEÑA -->
        <div *ngIf="paso === 2" class="step-container">
          <p class="step-description">
            Ingresa el código que recibiste y tu nueva contraseña
          </p>

          <div class="form-group">
            <label for="token">🔑 Código de Recuperación:</label>
            <input
              type="text"
              id="token"
              [(ngModel)]="token"
              placeholder="Código recibido"
              [disabled]="loading"
            />
            <small class="help-text">
              ℹ️ Revisa tu email por el código de recuperación
            </small>
          </div>

          <div class="form-group">
            <label for="nueva_password">🔐 Nueva Contraseña:</label>
            <input
              type="password"
              id="nueva_password"
              [(ngModel)]="nueva_password"
              placeholder="Mínimo 6 caracteres"
              [disabled]="loading"
            />
            <small class="help-text">
              ℹ️ Usa letras, números y caracteres especiales
            </small>
          </div>

          <div class="form-group">
            <label for="confirmar_password">✅ Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmar_password"
              [(ngModel)]="confirmar_password"
              placeholder="Repite tu contraseña"
              [disabled]="loading"
            />
          </div>

          <button
            class="btn-primary"
            (click)="resetearPassword()"
            [disabled]="loading"
          >
            {{ loading ? '⏳ Reseteando...' : '✅ Confirmar Cambio' }}
          </button>

          <button class="btn-secondary" (click)="volverAlPaso1()">
            ← Atrás
          </button>
        </div>

        <!-- PASO 3: ÉXITO -->
        <div *ngIf="paso === 3" class="step-container success-step">
          <div class="success-icon">✅</div>
          <h2>¡Contraseña Reseteada!</h2>
          <p class="success-message">
            Tu contraseña ha sido cambiada correctamente.
            <br>
            Redirigiendo al login en {{ conteoRegresiva }} segundos...
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recuperar-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .recuperar-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      width: 100%;
    }

    h1 {
      margin: 0 0 1rem 0;
      color: #333;
      text-align: center;
      font-size: 1.6rem;
    }

    h2 {
      margin: 0.5rem 0;
      color: #333;
      text-align: center;
      font-size: 1.3rem;
    }

    .step-description {
      color: #666;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid;
      font-size: 0.9rem;
    }

    .alert-danger {
      background: #ffebee;
      color: #d32f2f;
      border-left-color: #d32f2f;
    }

    .alert-success {
      background: #e8f5e9;
      color: #388e3c;
      border-left-color: #388e3c;
    }

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }

    input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s, box-shadow 0.3s;
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

    .help-text {
      display: block;
      font-size: 0.8rem;
      color: #999;
      margin-top: 0.3rem;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
      margin-bottom: 0.75rem;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      width: 100%;
      padding: 0.75rem;
      background: #757575;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #616161;
    }

    .link-volver {
      display: block;
      text-align: center;
      margin-top: 1rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .link-volver:hover {
      color: #5568d3;
      text-decoration: underline;
    }

    .step-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .success-step {
      text-align: center;
      padding: 2rem 0;
    }

    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .success-message {
      color: #666;
      font-size: 1rem;
      line-height: 1.6;
      margin: 1rem 0;
    }

    @media (max-width: 768px) {
      .recuperar-card {
        margin: 1rem;
        padding: 1.5rem;
      }

      h1 {
        font-size: 1.3rem;
      }

      h2 {
        font-size: 1.1rem;
      }
    }
  `]
})
export class RecuperarPasswordComponent {
  paso: 1 | 2 | 3 = 1;
  email = '';
  token = '';
  nueva_password = '';
  confirmar_password = '';
  loading = false;
  error = '';
  mensaje = '';
  conteoRegresiva = 5;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  solicitarRecuperacion(): void {
    console.log('📧 Solicitando recuperación para:', this.email);

    if (!this.email) {
      this.error = '❌ Ingresa tu email';
      return;
    }

    if (!this.email.includes('@')) {
      this.error = '❌ Email inválido';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post(
      'https://api-infra-actividades-prod-aqcuagc5bje7ddfu.westcentralus-01.azurewebsites.net/recuperar-password',
      { email: this.email }
    ).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del servidor:', response);
        this.loading = false;
        this.mensaje = '✅ ' + response.mensaje;
        
        if (response.tokenReset) {
          console.log('🔐 Token recibido (TESTING):', response.tokenReset);
          this.token = response.tokenReset;
          console.log('💡 Token copiado al campo. Puedes usarlo para continuar.');
        }
        
        setTimeout(() => {
          this.paso = 2;
          this.mensaje = '';
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('❌ Error:', err);
        this.error = '❌ Error: ' + (err.error?.message || 'Intenta de nuevo más tarde');
      }
    });
  }

  resetearPassword(): void {
    console.log('🔐 Reseteando contraseña...');

    if (!this.token) {
      this.error = '❌ Ingresa el código de recuperación';
      return;
    }

    if (!this.nueva_password || !this.confirmar_password) {
      this.error = '❌ Completa todos los campos';
      return;
    }

    if (this.nueva_password !== this.confirmar_password) {
      this.error = '❌ Las contraseñas no coinciden';
      return;
    }

    if (this.nueva_password.length < 6) {
      this.error = '❌ La contraseña debe tener mínimo 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('📤 Enviando solicitud de reset...');

    this.http.post(
      'https://api-infra-actividades-prod-aqcuagc5bje7ddfu.westcentralus-01.azurewebsites.net/resetear-password',
      { token: this.token, nueva_password: this.nueva_password }
    ).subscribe({
      next: (response: any) => {
        console.log('✅ Contraseña reseteada:', response);
        this.loading = false;
        this.paso = 3;
        
        this.iniciarConteo();
      },
      error: (err: any) => {
        this.loading = false;
        console.error('❌ Error al resetear:', err);
        this.error = '❌ ' + (err.error?.message || 'Error al resetear contraseña');
      }
    });
  }

  volverAlPaso1(): void {
    this.paso = 1;
    this.email = '';
    this.token = '';
    this.nueva_password = '';
    this.confirmar_password = '';
    this.error = '';
    this.mensaje = '';
  }

  iniciarConteo(): void {
    this.conteoRegresiva = 5;
    const intervalo = setInterval(() => {
      this.conteoRegresiva--;
      if (this.conteoRegresiva <= 0) {
        clearInterval(intervalo);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }
}