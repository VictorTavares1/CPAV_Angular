import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Serviço central que disponibiliza os URLs da API e dos uploads.
 * Os valores vêm dos ficheiros de ambiente (environment.ts / environment.development.ts),
 * pelo que mudam automaticamente entre desenvolvimento e produção sem alterar código.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly baseUrl = environment.apiBaseUrl;
  readonly uploadsUrl = environment.uploadsBaseUrl;

  get authUrl(): string {
    return `${this.baseUrl}/auth`;
  }

  get controllersUrl(): string {
    return `${this.baseUrl}/controllers`;
  }
}
