import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: AuthResponse | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user && 'token' in user && 'type' in user) {
        this.currentUser = user as AuthResponse;
      } else {
        this.currentUser = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getPageTitle(): string {
    const url = window.location.pathname;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/surveys')) return 'Pesquisas';
    if (url.includes('/profile')) return 'Perfil';
    if (url.includes('/admin')) return 'Administração';
    return 'Dizzme CX';
  }
}
