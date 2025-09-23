import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ExportRequest } from "../models/export.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  exportSurveyData(request: ExportRequest): Observable<Blob> {
    return this.http.post(`${this.API_URL}/export/survey`, request, {
      responseType: 'blob'
    });
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  exportToCSV(surveyId: number, filename?: string): Observable<Blob> {
    const request: ExportRequest = {
      surveyId,
      format: 'CSV',
      includeHeaders: true
    };
    return this.exportSurveyData(request);
  }

  exportToXLSX(surveyId: number, filename?: string): Observable<Blob> {
    const request: ExportRequest = {
      surveyId,
      format: 'XLSX',
      includeHeaders: true
    };
    return this.exportSurveyData(request);
  }
}