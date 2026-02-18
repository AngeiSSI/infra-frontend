import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  usuario: any = {};

  constructor(private auth: AuthService) {
    this.usuario = this.auth.getUsuario();
  }

  logout() {
    this.auth.logout();
  }
}
