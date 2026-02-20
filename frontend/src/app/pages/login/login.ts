import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%);
    }

    .login-left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .login-brand {
      text-align: center;
      max-width: 400px;
    }

.login-logo-container {
  width: 180px;
  height: 120px;
  margin: 0 auto 2rem;
  background: #CC0000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(204, 0, 0, 0.2);
  padding: 0.5rem;
}

.login-logo {
  width: 160px;
  height: 100px;
  object-fit: contain;
}

    .login-title {
      font-size: 2.5rem;
      color: #333;
      margin: 2rem 0 0.5rem 0;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .login-subtitle {
      font-size: 1rem;
      color: #999;
      margin-bottom: 2rem;
      font-weight: 500;
    }

    .login-right {
      flex: 1;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
    }

    .login-form {
      width: 100%;
      max-width: 400px;
    }

    .login-form h2 {
      color: #CC0000;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      font-weight: 800;
    }

    .login-form-subtitle {
      color: #999;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #CC0000;
      box-shadow: 0 0 0 3px rgba(204, 0, 0, 0.1);
    }

    .password-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #999;
      background: none;
      border: none;
      font-size: 1.2rem;
    }

    .login-actions {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      margin-top: 2rem;
    }

    .btn-login {
      flex: 1;
      padding: 0.85rem;
      background: #CC0000;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-login:hover:not(:disabled) {
      background: #AA0000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(204, 0, 0, 0.3);
    }

    .btn-login:disabled {
      background: #CCCCCC;
      cursor: not-allowed;
    }

    .btn-secondary {
      flex: 1;
      padding: 0.85rem;
      background: #F0F0F0;
      color: #333;
      border: 2px solid #E0E0E0;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #E8E8E8;
      border-color: #CC0000;
      color: #CC0000;
    }

    .login-footer {
      text-align: center;
      color: #999;
      font-size: 0.9rem;
    }

    .login-footer a {
      color: #CC0000;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    .error-message {
      background: #FFEBEE;
      color: #CC0000;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #CC0000;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .success-message {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #4CAF50;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }

      .login-left {
        padding: 1rem;
      }

      .login-right {
        box-shadow: none;
        border-top: 3px solid #CC0000;
        padding: 1.5rem;
      }

      .login-form {
        padding-top: 1rem;
      }

      .login-title {
        font-size: 2rem;
      }

      .login-logo-container {
        width: 150px;
        height: 100px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  cargando = false;
  error = '';
  showRecuperarPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ingresar() {
    console.log('📝 [LOGIN] Iniciando login con:', this.email);

    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ [LOGIN] Login exitoso');
        this.cargando = false;
        this.router.navigate(['/actividades']);
      },
      error: (err: any) => {
        console.log('❌ [LOGIN] Error:', err);
        this.cargando = false;
        this.error = err.error?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }

  onKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.ingresar();
    }
  }

  toggleRecuperarPassword() {
    this.showRecuperarPassword = !this.showRecuperarPassword;
    this.error = '';
  }

  recuperarPassword(emailRecuperar: string) {
    if (!emailRecuperar) {
      this.error = 'Por favor ingresa tu email';
      return;
    }

    this.cargando = true;
    this.authService.recuperarPassword(emailRecuperar).subscribe({
      next: () => {
        this.cargando = false;
        this.error = 'Revisa tu email para las instrucciones de recuperación';
        this.showRecuperarPassword = false;
      },
      error: (err: any) => {
        this.cargando = false;
        this.error = 'Error al procesar la solicitud';
      }
    });
  }
}