import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface EventoItem {
  id: number;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
}

export interface EventoItemAdmin extends EventoItem {
  idLocation: number;
  idState: number;
}

export interface LocalizacaoItem {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  listar(): Observable<EventoItem[]> {
    return this.http
      .get<EventoItem[]>(`${this.apiConfig.controllersUrl}/eventos/listar_eventos.php`)
      .pipe(catchError(() => of([])));
  }

  listarAdmin(): Observable<EventoItemAdmin[]> {
    return this.http
      .get<EventoItemAdmin[]>(`${this.apiConfig.controllersUrl}/eventos/listar_eventos_admin.php`)
      .pipe(catchError(() => of([])));
  }

  lerPorId(id: number): Observable<EventoItemAdmin | null> {
    return this.http
      .get<EventoItemAdmin>(`${this.apiConfig.controllersUrl}/eventos/listar_evento_por_id.php?id=${id}`)
      .pipe(catchError(() => of(null)));
  }

  lerLocalizacoes(): Observable<LocalizacaoItem[]> {
    return this.http
      .get<LocalizacaoItem[]>(`${this.apiConfig.controllersUrl}/eventos/listar_localizacoes.php`)
      .pipe(catchError(() => of([])));
  }

  inserir(data: { title: string; event_date: string; event_time: string; idLocation: number }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/eventos/inserir_evento.php`,
      data
    );
  }

  editar(data: { id: number; title: string; event_date: string; event_time: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/eventos/editar_evento.php`,
      data
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/eventos/toggle_evento.php`,
      { id }
    );
  }
}
