import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service'; // Assumindo um futuro AdminService
import { User } from '../../models/auth.model'; // Reutilizando o modelo de usuário
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  public totalUsers = 0;
  public totalSurveys = 0;
  public isLoading = true;
  public users: User[] = [];

  public editingUser: User | null = null;
  public editUserData: Partial<User> = {};
  public isSaving = false;

  constructor() {}

  ngOnInit(): void {
    this.loadAdminStats();
    this.loadUsers();
  }

  loadAdminStats(): void {
    // Simula o carregamento de estatísticas gerais
    this.adminService.getGlobalStats().subscribe({
      next: (stats) => {
        this.totalUsers = stats.totalUsers;
        this.totalSurveys = stats.totalSurveys;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading admin stats:', err);
        this.isLoading = false;
      },
    });
  }

  loadUsers(): void {
    // Simula o carregamento de uma lista de usuários
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
    this.editUserData = { name: user.name, email: user.email, role: user.role };
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.editUserData = {};
  }

  saveUser(): void {
    if (!this.editingUser) return;
    this.isSaving = true;
    this.adminService
      .updateUser(this.editingUser.id, this.editUserData)
      .subscribe({
        next: (updated) => {
          const idx = this.users.findIndex((u) => u.id === updated.id);
          if (idx > -1) this.users[idx] = updated;
          this.cancelEdit();
        },
        error: (err) => {
          alert('Erro ao atualizar usuário!');
          this.isSaving = false;
        },
        complete: () => (this.isSaving = false),
      });
  }
}
