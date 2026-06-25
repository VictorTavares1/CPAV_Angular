import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export interface ServicoItem {
  id: number;
  title: string;
  description: string;
  icon_or_image: string;
}

export interface ServicoItemAdmin extends ServicoItem {
  idState: number;
}

@Injectable({
  providedIn: 'root',
})
export class Servicos {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  listar(): Observable<ServicoItem[]> {
    return this.http
      .get<ServicoItem[]>(`${this.apiConfig.controllersUrl}/servicos/listar_servicos.php`)
      .pipe(catchError(() => of([])));
  }

  listarAdmin(): Observable<ServicoItemAdmin[]> {
    return this.http
      .get<ServicoItemAdmin[]>(`${this.apiConfig.controllersUrl}/servicos/listar_servicos_admin.php`, { withCredentials: true })
      .pipe(catchError(() => of([])));
  }

  lerPorId(id: number): Observable<ServicoItemAdmin> {
    return this.http
      .get<ServicoItemAdmin>(`${this.apiConfig.controllersUrl}/servicos/listar_servico_por_id.php?id=${id}`, { withCredentials: true });
  }

  inserir(data: { title: string; description: string; icon_or_image: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/servicos/inserir_servico.php`,
      data,
      { withCredentials: true }
    );
  }

  editar(data: { id: number; title: string; description: string; icon_or_image: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/servicos/editar_servico.php`,
      data,
      { withCredentials: true }
    );
  }

  editarComImagem(formData: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/servicos/editar_servico.php`,
      formData,
      { withCredentials: true }
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/servicos/toggle_servico.php`,
      { id },
      { withCredentials: true }
    );
  }
}
