import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export type UserRole = 'admin' | 'super_admin';

interface LoginResponse {
  message: string;
  idUser: number;
  email: string;
  role: UserRole;
}

interface SessionResponse {
  authenticated: boolean;
  idUser?: number;
  email?: string;
  role?: UserRole;
}

export interface CurrentUser {
  idUser: number;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  get isSuperAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'super_admin';
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiConfig.authUrl}/login.php`, { email, password })
      .pipe(tap((res) => {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next({
          idUser: res.idUser,
          email: res.email,
          role: res.role,
        });
      }));
  }

  logout(): Observable<void> {
    return this.http
      .post<{ message: string }>(`${this.apiConfig.authUrl}/logout.php`, {})
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        }),
        map(() => void 0),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          return of(void 0);
        })
      );
  }

  checkSession(): Observable<boolean> {
    return this.http
      .get<SessionResponse>(`${this.apiConfig.authUrl}/check_session.php`)
      .pipe(
        map((response) => {
          if (response.authenticated && response.idUser && response.email && response.role) {
            this.currentUserSubject.next({
              idUser: response.idUser,
              email: response.email,
              role: response.role,
            });
            return true;
          }
          this.currentUserSubject.next(null);
          return false;
        }),
        tap((isAuthenticated) => this.isAuthenticatedSubject.next(isAuthenticated)),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          return of(false);
        })
      );
  }
}
