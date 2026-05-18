import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

interface LoginResponse {
  message: string;
  idUser: number;
  email: string;
}

interface SessionResponse {
  authenticated: boolean;
  idUser?: number;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiConfig.authUrl}/login.php`, { email, password })
      .pipe(tap(() => this.isAuthenticatedSubject.next(true)));
  }

  logout(): Observable<void> {
    return this.http
      .post<{ message: string }>(`${this.apiConfig.authUrl}/logout.php`, {})
      .pipe(
        tap(() => this.isAuthenticatedSubject.next(false)),
        map(() => void 0),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          return of(void 0);
        })
      );
  }

  checkSession(): Observable<boolean> {
    return this.http
      .get<SessionResponse>(`${this.apiConfig.authUrl}/check_session.php`)
      .pipe(
        map((response) => response.authenticated === true),
        tap((isAuthenticated) => this.isAuthenticatedSubject.next(isAuthenticated)),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          return of(false);
        })
      );
  }
}
