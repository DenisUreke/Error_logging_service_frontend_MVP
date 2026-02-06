import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorIn, ErrorOut } from '../models/error.models';

@Injectable({ providedIn: 'root' })
export class ErrorApiService {
  // put this in environment.ts later
  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  health(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrl}/health`);
  }

  createError(payload: ErrorIn): Observable<ErrorOut> {
    return this.http.post<ErrorOut>(`${this.baseUrl}/errors`, payload);
  }

  listErrors(limit = 50): Observable<ErrorOut[]> {
    return this.http.get<ErrorOut[]>(`${this.baseUrl}/errors`, {
      params: { limit },
    });
  }
}
