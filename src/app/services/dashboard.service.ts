import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Noticias } from './noticias';
import { Contactos } from './contactos';
import { Servicos } from './servicos';
import { RelatoriosService } from './relatorios.service';
import { EventosService } from './eventos.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private readonly noticiasService: Noticias,
    private readonly eventosService: EventosService,
    private readonly servicosService: Servicos,
    private readonly contactosService: Contactos,
    private readonly relatoriosService: RelatoriosService
  ) {}

  getNoticiasCount() {
    return this.noticiasService.listar().pipe(map((rows) => rows.length));
  }

  getEventosCount() {
    return this.eventosService.listar().pipe(map((rows) => rows.length));
  }

  getServicosCount() {
    return this.servicosService.listar().pipe(map((rows) => rows.length));
  }

  getContactosCount() {
    return this.contactosService.listar().pipe(map((rows) => rows.length));
  }

  getRelatoriosCount() {
    return this.relatoriosService.listar().pipe(map((rows) => rows.length));
  }
}
