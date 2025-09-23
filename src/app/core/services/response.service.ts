import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ResponseSubmitRequest, ResponseDto } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitResponse(request: ResponseSubmitRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/responses/submit`, request);
  }

  getSurveyResponses(surveyId: number): Observable<ApiResponse<ResponseDto[]>> {
    return this.http.get<ApiResponse<ResponseDto[]>>(`${this.API_URL}/responses/survey/${surveyId}`);
  }
}