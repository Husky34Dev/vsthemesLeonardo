import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getUserThemes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/themes`);
  }

  downloadTheme(themeId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/theme/${themeId}/download`, { responseType: 'blob' });
  }
}
