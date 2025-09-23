import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { SurveyDto,
  SurveyCreateRequest,
  SurveyUpdateRequest,
  SurveySummaryDto,
  SurveyTemplate,
  SurveyStatsDto
} from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createSurvey(request: SurveyCreateRequest): Observable<ApiResponse<SurveyDto>> {
    return this.http.post<ApiResponse<SurveyDto>>(`${this.API_URL}/surveys`, request);
  }

  getMySurveys(): Observable<ApiResponse<SurveySummaryDto[]>> {
    return this.http.get<ApiResponse<SurveySummaryDto[]>>(`${this.API_URL}/surveys/my`);
  }

  getSurvey(id: number): Observable<ApiResponse<SurveyDto>> {
    return this.http.get<ApiResponse<SurveyDto>>(`${this.API_URL}/surveys/${id}`);
  }

  getPublicSurvey(publicId: string): Observable<ApiResponse<SurveyDto>> {
    return this.http.get<ApiResponse<SurveyDto>>(`${this.API_URL}/surveys/public/${publicId}`);
  }

  updateSurvey(id: number, request: SurveyUpdateRequest): Observable<ApiResponse<SurveyDto>> {
    return this.http.patch<ApiResponse<SurveyDto>>(`${this.API_URL}/surveys/${id}`, request);
  }

  deleteSurvey(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.API_URL}/surveys/${id}`);
  }

  getTemplates(): Observable<ApiResponse<SurveyTemplate[]>> {
    return this.http.get<ApiResponse<SurveyTemplate[]>>(`${this.API_URL}/templates`);
  }

  duplicateSurvey(id: number): Observable<ApiResponse<SurveyDto>> {
    // This would be a helper method to duplicate a survey
    return this.getSurvey(id);
  }

  getSurveyStats(id: number): Observable<ApiResponse<SurveyStatsDto>> {
    return this.http.get<ApiResponse<SurveyStatsDto>>(`${this.API_URL}/dashboard/survey/${id}/stats`);
  }
}