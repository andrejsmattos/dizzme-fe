import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User, LoginRequest, AuthResponse, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
} )
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'auth_token';

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly http = inject(HttpClient );
  private readonly router = inject(Router);

  constructor() {
    this.loadUserFromStorage();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, credentials ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeAuthData(response.data);
        }
      })
    );
  }

  public register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, userData ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeAuthData(response.data);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']); 
  }

  private storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);

    const user: User = {
      id: authResponse.id,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role
    };
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          this.logout();
          return;
        }

        const user: User = {
          id: payload.sub, 
          name: payload.name,
          email: payload.email,
          role: payload.role
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Falha ao decodificar o token, realizando logout.', error);
        this.logout();
      }
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
 * Verifica se o usuário atual possui uma role específica.
 * @param role A role a ser verificada (ex: 'ADMIN', 'USER').
 */
  public hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

 public updateUserProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/profile`, userData ).pipe(
      tap(response => {
        if (response.success && response.data) {
          const updatedUser = response.data;
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }


}
