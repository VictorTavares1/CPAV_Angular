import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface LocalizacaoItem {
  id: number;
  name: string;
}

export interface LocalizacaoAdminItem extends LocalizacaoItem {
  idState: number;
}

@Injectable({ providedIn: 'root' })
export class LocaizacoesService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  listar(): Observable<LocalizacaoItem[]> {
    return this.http
      .get<LocalizacaoItem[]>(`${this.apiConfig.controllersUrl}/localizacoes/listar_localizacoes.php`)
      .pipe(catchError(() => of([])));
  }

  listarAdmin(): Observable<LocalizacaoAdminItem[]> {
    return this.http
      .get<LocalizacaoAdminItem[]>(`${this.apiConfig.controllersUrl}/localizacoes/listar_localizacoes_admin.php`, { withCredentials: true })
      .pipe(catchError(() => of([])));
  }

  inserir(name: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/localizacoes/inserir_localizacao.php`,
      { name },
      { withCredentials: true }
    );
  }

  editar(id: number, name: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/localizacoes/editar_localizacao.php`,
      { id, name },
      { withCredentials: true }
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/localizacoes/toggle_localizacao.php`,
      { id },
      { withCredentials: true }
    );
  }
}
