import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user; 
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
