import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface NoticiaItem {
  id: number;
  title: string;
  content: string;
  dateHour?: string;
  idState?: number;
  images?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Noticias {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  getById(id: number): Observable<NoticiaItem> {
    return this.http.get<NoticiaItem>(
      `${this.apiConfig.controllersUrl}/noticias/listar_noticia_por_id.php?id=${id}`
    );
  }

  listar(): Observable<NoticiaItem[]> {
    return this.http
      .get<NoticiaItem[]>(`${this.apiConfig.controllersUrl}/noticias/listar_noticias.php`)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of([]);
          }
          throw error;
        })
      );
  }

  listarAdmin(): Observable<NoticiaItem[]> {
    return this.http
      .get<NoticiaItem[]>(`${this.apiConfig.controllersUrl}/noticias/listar_noticias_admin.php`)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of([]);
          }
          throw error;
        })
      );
  }

  inserir(payload: Pick<NoticiaItem, 'title' | 'content'>): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(
      `${this.apiConfig.controllersUrl}/noticias/inserir_noticia.php`,
      payload
    );
  }

  inserirComImagem(formData: FormData): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(
      `${this.apiConfig.controllersUrl}/noticias/inserir_noticia.php`,
      formData
    );
  }

  editar(payload: Pick<NoticiaItem, 'id' | 'title' | 'content'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/noticias/editar_noticia.php`,
      payload
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/noticias/toggle_noticia.php`,
      { id }
    );
  }
}
