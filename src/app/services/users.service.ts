import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';
import { UserRole } from './auth.service';

export interface UserItem {
  id: number;
  email: string;
  role: UserRole;
  idState: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  listar(): Observable<UserItem[]> {
    return this.http
      .get<UserItem[]>(`${this.apiConfig.controllersUrl}/users/listar_users.php`, { withCredentials: true })
      .pipe(catchError(() => of([])));
  }

  lerPorId(id: number): Observable<UserItem> {
    return this.http.get<UserItem>(
      `${this.apiConfig.controllersUrl}/users/listar_user_por_id.php?id=${id}`,
      { withCredentials: true }
    );
  }

  inserir(data: { email: string; password: string; role: UserRole }): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(
      `${this.apiConfig.controllersUrl}/users/inserir_user.php`,
      data,
      { withCredentials: true }
    );
  }

  editar(data: { id: number; email: string; role: UserRole }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/users/editar_user.php`,
      data,
      { withCredentials: true }
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/users/toggle_user.php`,
      { id },
      { withCredentials: true }
    );
  }

  mudarPassword(id: number, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/users/mudar_password.php`,
      { id, password },
      { withCredentials: true }
    );
  }

  mudarPasswordPropria(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/users/mudar_password_propria.php`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
  }
}
