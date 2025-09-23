import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDashboardDto, DashboardStatsDto, SurveyStatsDto } from '../models/dashboard.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStatsDto>> {
    return this.http.get<ApiResponse<DashboardStatsDto>>(`${this.API_URL}/dashboard/stats`);
  }

  getSurveyStats(surveyId: number): Observable<ApiResponse<SurveyStatsDto>> {
    return this.http.get<ApiResponse<SurveyStatsDto>>(`${this.API_URL}/dashboard/survey/${surveyId}/stats`);
  }

  getAdminDashboard(): Observable<ApiResponse<AdminDashboardDto>> {
    return this.http.get<ApiResponse<AdminDashboardDto>>(`${this.API_URL}/admin/dashboard`);
  }
}