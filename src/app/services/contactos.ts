import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface ContactoItem {
  id: number;
  type: string;
  value: string;
  icon: string;
}

export interface ContactoItemAdmin extends ContactoItem {
  idState: number;
}

@Injectable({
  providedIn: 'root',
})
export class Contactos {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  listar(): Observable<ContactoItem[]> {
    return this.http
      .get<ContactoItem[]>(`${this.apiConfig.controllersUrl}/contactos/listar_contactos.php`)
      .pipe(catchError(() => of([])));
  }

  listarAdmin(): Observable<ContactoItemAdmin[]> {
    return this.http
      .get<ContactoItemAdmin[]>(`${this.apiConfig.controllersUrl}/contactos/listar_contactos_admin.php`, { withCredentials: true })
      .pipe(catchError(() => of([])));
  }

  lerPorId(id: number): Observable<ContactoItemAdmin> {
    return this.http
      .get<ContactoItemAdmin>(`${this.apiConfig.controllersUrl}/contactos/listar_contacto_por_id.php?id=${id}`, { withCredentials: true });
  }

  inserir(data: { type: string; value: string; icon: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/contactos/inserir_contacto.php`,
      data,
      { withCredentials: true }
    );
  }

  editar(data: { id: number; type: string; value: string; icon: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/contactos/editar_contacto.php`,
      data,
      { withCredentials: true }
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/contactos/toggle_contacto.php`,
      { id },
      { withCredentials: true }
    );
  }
}
