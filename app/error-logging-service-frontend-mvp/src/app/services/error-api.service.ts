import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorOut } from '../models/error.models';

@Injectable({ providedIn: 'root' })
export class ErrorApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000'; // adjust if needed

  constructor(private http: HttpClient) {}

  listErrors(limit = 50): Observable<ErrorOut[]> {
    return this.http.get<ErrorOut[]>(`${this.baseUrl}/errors`, { params: { limit } });
  }

  downloadHealthPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/report/health.pdf`, { responseType: 'blob' });
  }
}
