import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCurrentClient(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/clients/me`);
  }

  updateCurrentClient(request: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.API_URL}/clients/me`, request);
  }

  getAllClients(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/clients?page=${page}&size=${size}`);
  }
}