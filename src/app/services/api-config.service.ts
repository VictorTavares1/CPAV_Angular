import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly baseUrl = 'http://localhost/CPAV_Angular/CPAV_api/api';
  readonly uploadsUrl = 'http://localhost/CPAV_Angular/CPAV_api/uploads';

  get authUrl(): string {
    return `${this.baseUrl}/auth`;
  }

  get controllersUrl(): string {
    return `${this.baseUrl}/controllers`;
  }
}
