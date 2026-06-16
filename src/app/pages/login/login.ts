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
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.error = 'Email y contraseña requeridos';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('✅ Login exitoso');
        this.router.navigate(['/dashboard-ejecutivo']);
      },
      error: (err: any) => {
        console.error('❌ Error:', err);
        this.error = err.error?.error || 'Error en el login';
        this.cargando = false;
      }
    });
  }
}