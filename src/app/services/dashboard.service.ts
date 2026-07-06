import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Noticias } from './noticias';
import { Contactos } from './contactos';
import { Servicos } from './servicos';
import { RelatoriosService } from './relatorios.service';
import { EventosService } from './eventos.service';
import { FacilitiesService } from './facilities.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private readonly noticiasService: Noticias,
    private readonly eventosService: EventosService,
    private readonly servicosService: Servicos,
    private readonly contactosService: Contactos,
    private readonly relatoriosService: RelatoriosService,
    private readonly facilitiesService: FacilitiesService,
    private readonly usersService: UsersService,
  ) {}

  getNoticiasCount() {
    return this.noticiasService.listarAdmin().pipe(map((rows) => rows.length));
  }

  getEventosCount() {
    return this.eventosService.listarAdmin().pipe(map((rows) => rows.length));
  }

  getServicosCount() {
    return this.servicosService.listarAdmin().pipe(map((rows) => rows.length));
  }

  getContactosCount() {
    return this.contactosService.listarAdmin().pipe(map((rows) => rows.length));
  }

  getRelatoriosCount() {
    return this.relatoriosService.listarAdmin().pipe(map((rows) => rows.length));
  }

  getInstalacoesCount() {
    return this.facilitiesService.listarAdmin().pipe(
      map((rows) => rows.filter(f => f.category === 'instalacao').length)
    );
  }

  getLocalizacoesCount() {
    return this.eventosService.lerLocalizacoes().pipe(map((rows) => rows.length));
  }

  getUsersCount() {
    return this.usersService.listar().pipe(map((rows) => rows.length));
  }
}
