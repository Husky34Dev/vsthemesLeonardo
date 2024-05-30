import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user`, user);
  }
  logout(): void {
    localStorage.removeItem('access_token');
  }
  getUserThemes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/themes`);
  }

  downloadTheme(themeId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/theme/${themeId}/download`, { responseType: 'blob' });
  }
}
