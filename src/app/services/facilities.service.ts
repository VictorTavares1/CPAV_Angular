import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

export type FacilityCategory = 'instalacao' | 'departamento';

export interface FacilityItem {
  id: number;
  category: FacilityCategory;
  name: string;
  icon: string | null;
  address: string | null;
  tel: string | null;
  mobile: string | null;
  email: string | null;
  responsavel_nome: string | null;
  responsavel_cargo: string | null;
  linked_facility: string | null;
  services: string | null;
  sort_order: number;
}

export interface FacilityItemAdmin extends FacilityItem {
  idState: number;
}

export interface FacilityPayload {
  category: FacilityCategory;
  name: string;
  icon: string | null;
  address: string | null;
  tel: string | null;
  mobile: string | null;
  email: string | null;
  responsavel_nome: string | null;
  responsavel_cargo: string | null;
  linked_facility: string | null;
  services: string | null;
  sort_order: number;
}

@Injectable({ providedIn: 'root' })
export class FacilitiesService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  listar(category?: FacilityCategory): Observable<FacilityItem[]> {
    const url = category
      ? `${this.apiConfig.controllersUrl}/facilities/listar_facilities.php?category=${category}`
      : `${this.apiConfig.controllersUrl}/facilities/listar_facilities.php`;
    return this.http.get<FacilityItem[]>(url).pipe(catchError(() => of([])));
  }

  listarAdmin(): Observable<FacilityItemAdmin[]> {
    return this.http
      .get<FacilityItemAdmin[]>(
        `${this.apiConfig.controllersUrl}/facilities/listar_facilities_admin.php`,
        { withCredentials: true }
      )
      .pipe(catchError(() => of([])));
  }

  lerPorId(id: number): Observable<FacilityItemAdmin> {
    return this.http.get<FacilityItemAdmin>(
      `${this.apiConfig.controllersUrl}/facilities/listar_facility_por_id.php?id=${id}`,
      { withCredentials: true }
    );
  }

  inserir(data: FacilityPayload): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(
      `${this.apiConfig.controllersUrl}/facilities/inserir_facility.php`,
      data,
      { withCredentials: true }
    );
  }

  editar(data: FacilityPayload & { id: number }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/facilities/editar_facility.php`,
      data,
      { withCredentials: true }
    );
  }

  toggle(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiConfig.controllersUrl}/facilities/toggle_facility.php`,
      { id },
      { withCredentials: true }
    );
  }
}
