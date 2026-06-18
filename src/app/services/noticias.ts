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

export interface NoticiaImage {
  id: number;
  url: string;
}

export interface NoticiaAdminDetail {
  id: number;
  title: string;
  content: string;
  dateHour?: string;
  idState: number;
  images: NoticiaImage[];
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

  /** Usado pelo painel admin. Devolve a notícia mesmo se estiver inativa,
   *  e as imagens como objetos {id, url} (para podermos identificar quais remover). */
  getByIdAdmin(id: number): Observable<NoticiaAdminDetail> {
    return this.http.get<NoticiaAdminDetail>(
      `${this.apiConfig.controllersUrl}/noticias/listar_noticia_admin_por_id.php?id=${id}`,
      { withCredentials: true }
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

  /** Atualiza notícia com texto + imagens novas + IDs de imagens a remover. */
  editarComImagens(formData: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/noticias/editar_noticia.php`,
      formData,
      { withCredentials: true }
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/noticias/toggle_noticia.php`,
      { id }
    );
  }
}
