import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

     this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            const data = response.data; // 👈 pega o objeto real que vem do backend

            // Monta o AuthResponse do frontend
            const authResponse = {
              token: data.token,
              type: data.type,
              user: {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
              }
            };

            // Salva no localStorage
            localStorage.setItem('auth', JSON.stringify(authResponse));

            this.router.navigate(['/dashboard']);
          }
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erro ao fazer login';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
}
