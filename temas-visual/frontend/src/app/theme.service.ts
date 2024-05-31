import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getUserThemes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/themes`);
  }

  downloadTheme(themeId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/theme/${themeId}/download`, { responseType: 'blob' });
  }

  downloadLeonardoTheme(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/theme/download/leonardo`, { responseType: 'blob' });
  }
}
