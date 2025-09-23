import { Component, HostListener, OnInit } from '@angular/core';
import { AuthResponse } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
})
export class LayoutComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  showSidebar = false;
  isDesktop = window.innerWidth >= 768;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.showSidebar = false;
    }
  }
}