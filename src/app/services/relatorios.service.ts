import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface RelatorioItem {
  id: number;
  title: string;
  url: string;
  typeName: string;
}

export interface RelatorioItemAdmin extends RelatorioItem {
  idState: number;
}

export interface TipoItem {
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class RelatoriosService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  listar(): Observable<RelatorioItem[]> {
    return this.http
      .get<RelatorioItem[]>(`${this.apiConfig.controllersUrl}/relatorios/listar_relatorios.php`)
      .pipe(catchError(() => of([])));
  }

  listarAdmin(): Observable<RelatorioItemAdmin[]> {
    return this.http
      .get<RelatorioItemAdmin[]>(`${this.apiConfig.controllersUrl}/relatorios/listar_relatorios_admin.php`)
      .pipe(catchError(() => of([])));
  }

  lerTipos(): Observable<TipoItem[]> {
    return this.http
      .get<TipoItem[]>(`${this.apiConfig.controllersUrl}/relatorios/listar_tipos.php`)
      .pipe(catchError(() => of([])));
  }

  inserir(formData: FormData): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(
      `${this.apiConfig.controllersUrl}/relatorios/inserir_relatorio.php`,
      formData
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/relatorios/toggle_relatorio.php`,
      { id }
    );
  }

  pdfUrl(filename: string): string {
    return `${this.apiConfig.uploadsUrl}/relatorios/${encodeURIComponent(filename)}`;
  }
}
