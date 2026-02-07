import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorOut } from '../models/error.models';
import { ServiceOut, RuleRowOut, RuleIn } from '../models/rules.models';
import { UserOut } from '../models/user.models';


@Injectable({ providedIn: 'root' })
export class ErrorApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000'; // adjust if needed

  constructor(private http: HttpClient) { }

  listErrors(limit = 50): Observable<ErrorOut[]> {
    return this.http.get<ErrorOut[]>(`${this.baseUrl}/errors`, { params: { limit } });
  }

  downloadHealthPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/report/health.pdf`, { responseType: 'blob' });
  }

  listServices(): Observable<ServiceOut[]> {
    return this.http.get<ServiceOut[]>(`${this.baseUrl}/services`);
  }

  listRulesByMachine(machine: string): Observable<RuleRowOut[]> {
    const params = new HttpParams().set('machine', machine);
    return this.http.get<RuleRowOut[]>(`${this.baseUrl}/rules/by-machine`, { params });
  }

  upsertRule(payload: RuleIn): Observable<any> {
    return this.http.post(`${this.baseUrl}/rules`, payload);
  }

  deleteRule(ruleId: number) {
    return this.http.delete(`${this.baseUrl}/rules/${ruleId}`);
  }

  listUsers() {
  return this.http.get<UserOut[]>(`${this.baseUrl}/users`);
}



}
