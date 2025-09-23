import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model'; // Um modelo genérico para a resposta da API

// --- Definição dos Tipos de Dados para este Serviço ---

// O que esperamos receber do endpoint de estatísticas globais
export interface GlobalStats {
  totalUsers: number;
  totalSurveys: number;
  totalResponses: number;
}

@Injectable({
  providedIn: 'root' // O serviço é registrado na raiz da aplicação
} )
export class AdminService {
  // Injeção de dependência moderna e URL da API
  private readonly http = inject(HttpClient );
  private readonly apiUrl = `${environment.apiUrl}/admin`; // URL base para os endpoints de admin

  constructor() { }

  /**
   * Busca as estatísticas globais do sistema.
   * @returns Um Observable com as estatísticas.
   */
  getGlobalStats(): Observable<GlobalStats> {
    // Para o desenvolvimento, podemos retornar dados mocados (falsos) se a API ainda não estiver pronta.
    // Descomente a chamada HTTP quando o endpoint existir.
    
    // return this.http.get<ApiResponse<GlobalStats>>(`${this.apiUrl}/stats` ).pipe(
    //   map(response => response.data)
    // );

    // --- DADOS MOCADOS PARA DESENVOLVIMENTO ---
    console.warn('AdminService: Usando dados mocados para getGlobalStats()');
    const mockStats: GlobalStats = {
      totalUsers: 125,
      totalSurveys: 42,
      totalResponses: 1843
    };
    return of(mockStats); // 'of' cria um Observable que emite um valor imediatamente.
    // --- FIM DOS DADOS MOCADOS ---
  }

  /**
   * Busca uma lista de todos os usuários registrados no sistema.
   * @returns Um Observable com um array de usuários.
   */
  getAllUsers(): Observable<User[]> {
    // Descomente a chamada HTTP quando o endpoint '/admin/users' estiver pronto.
    
    // return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users` ).pipe(
    //   map(response => response.data)
    // );

    // --- DADOS MOCADOS PARA DESENVOLVIMENTO ---
    console.warn('AdminService: Usando dados mocados para getAllUsers()');
    const mockUsers: User[] = [
      { id: 1, name: 'André (Admin)', email: 'andre.admin@example.com', role: 'ADMIN' },
      { id: 2, name: 'Maria Silva', email: 'maria.silva@example.com', role: 'USER' },
      { id: 3, name: 'João Pereira', email: 'joao.p@example.com', role: 'USER' },
      { id: 4, name: 'Ana Costa', email: 'ana.costa@example.com', role: 'USER' }
    ];
    return of(mockUsers);
    // --- FIM DOS DADOS MOCADOS ---
  }

  /**
   * Atualiza os dados de um usuário específico.
   * @param userId O ID do usuário a ser atualizado.
   * @param userData Os novos dados do usuário.
   * @returns Um Observable com o usuário atualizado.
   */
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/users/${userId}`, userData ).pipe(
      map(response => response.data)
    );
  }
}
