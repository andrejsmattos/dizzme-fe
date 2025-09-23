import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { QRCodeResponse } from '../models/qrcode.model';

// QR Code Service
@Injectable({
  providedIn: 'root'
})
export class QRCodeService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  generateQRCode(url: string, size: number = 300): Observable<ApiResponse<QRCodeResponse>> {
    return this.http.get<ApiResponse<QRCodeResponse>>(
      `${this.API_URL}/qr/generate?url=${encodeURIComponent(url)}&size=${size}`
    );
  }

  generateSurveyQRCode(surveyPublicId: string, size: number = 300): Observable<ApiResponse<QRCodeResponse>> {
    return this.http.get<ApiResponse<QRCodeResponse>>(
      `${this.API_URL}/qr/survey/${surveyPublicId}?size=${size}`
    );
  }
}