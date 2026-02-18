import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.8rem;
    }

    .subtitle {
      text-align: center;
      color: #999;
      margin: 0 0 2rem 0;
      font-size: 0.95rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 600;
      font-size: 0.95rem;
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

    button {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover:not(:disabled) {
      background: #5568d3;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #d32f2f;
      background: #ffebee;
      padding: 0.75rem;
      border-radius: 4px;
      text-align: center;
      font-size: 0.95rem;
      border-left: 4px solid #d32f2f;
    }

    .links-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: color 0.3s;
    }

    .link:hover {
      color: #5568d3;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-card {
        margin: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .links-container {
        flex-direction: column;
        gap: 0.5rem;
      }

      .link {
        text-align: center;
      }
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/actividades']);
    }
  }

  ingresar(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa email y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('📝 [LOGIN] Iniciando login con:', this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ [LOGIN] Login exitoso:', response);
        
        this.loading = false;
        const token = this.authService.getToken();
        const usuario = this.authService.getUsuario();

        console.log('✅ [LOGIN] Token:', !!token);
        console.log('✅ [LOGIN] Usuario:', usuario);
        console.log('✅ [LOGIN] primeraVez:', usuario?.primeraVez);

        if (token && usuario) {
          // ✅ SI ES PRIMERA VEZ, REDIRIGIR A CAMBIAR CONTRASEÑA
          if (usuario.primeraVez === true) {
            console.log('🔐 [LOGIN] Primera vez - Redirigiendo a cambiar contraseña');
            this.router.navigate(['/cambiar-password']);
          } else {
            console.log('📊 [LOGIN] Redirigiendo a actividades');
            this.router.navigate(['/actividades']);
          }
        } else {
          this.error = 'Error: Token o usuario no se guardó correctamente';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Credenciales inválidas o error de servidor';
        console.error('❌ [LOGIN] Error:', err);
      }
    });
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.ingresar();
    }
  }
}