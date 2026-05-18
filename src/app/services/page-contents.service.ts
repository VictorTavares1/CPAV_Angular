import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface PageContentItem {
  id: number;
  Page_name: string;
  section_key: string;
  content_type: string;
  content_value: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class PageContentsService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  listar(page?: string): Observable<PageContentItem[]> {
    const url = page
      ? `${this.apiConfig.controllersUrl}/page_contents/listar_page_contents.php?page=${encodeURIComponent(page)}`
      : `${this.apiConfig.controllersUrl}/page_contents/listar_page_contents.php`;
    return this.http.get<PageContentItem[]>(url).pipe(catchError(() => of([])));
  }

  editar(id: number, content_value: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/page_contents/editar_page_content.php`,
      { id, content_value },
      { withCredentials: true }
    );
  }
}
