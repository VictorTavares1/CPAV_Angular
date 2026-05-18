import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface LogItem {
  dateHour: string;
  adminEmail: string;
  operationTitle: string;
  alvoTitle: string | null;
}

export interface Operation {
  id: number;
  title: string;
}

export interface LogsResponse {
  data: LogItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  operations: Operation[];
}

@Injectable({ providedIn: 'root' })
export class LogsService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiConfigService);

  listar(params: {
    page?: number;
    perPage?: number;
    operationId?: number;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Observable<LogsResponse> {
    const query = new URLSearchParams();
    if (params.page)        query.set('page',        String(params.page));
    if (params.perPage)     query.set('perPage',     String(params.perPage));
    if (params.operationId) query.set('operationId', String(params.operationId));
    if (params.dateFrom)    query.set('dateFrom',    params.dateFrom);
    if (params.dateTo)      query.set('dateTo',      params.dateTo);

    const qs = query.toString() ? `?${query}` : '';
    return this.http.get<LogsResponse>(
      `${this.api.controllersUrl}/logs/listar_logs.php${qs}`
    );
  }
}
