import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model'; // Assumindo que o AuthService gerencia os dados do usuário

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Para o formulário de edição
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  // Injeção de dependência
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  public user: User | null = null;
  public profileForm!: FormGroup;
  public isEditing = false;
  public isSubmitting = false;
  public errorMessage = ''; // Adicione esta linha

  constructor() {
    // Inicializa o formulário com validações
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }], // O e-mail geralmente não é editável
      companyName: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // O AuthService deve ter um método para obter o usuário atual
    this.user = this.authService.currentUserValue;
    if (this.user) {
      // Preenche o formulário com os dados do usuário
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        companyName: this.user.companyName || ''
      });
    }
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Se o usuário cancelar a edição, restaura os dados originais
      this.loadUserData();
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isSubmitting = true;
    const updatedData = this.profileForm.getRawValue(); // getRawValue() inclui campos desabilitados

    // Chama o serviço para atualizar os dados do usuário
    this.authService.updateUserProfile(updatedData).subscribe({
      next: (response: any) => {
        const updatedUser = response.data || response.result || response.user || response;
        this.toastr.success('Perfil atualizado com sucesso!');
        this.user = updatedUser;
        this.isEditing = false;
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao atualizar perfil.';
        this.isSubmitting = false;
      }
    });
  }
}