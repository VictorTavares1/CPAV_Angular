import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventosService, EventoItem } from '../../services/eventos.service';
import { LocaizacoesService } from '../../services/localizacoes.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-eventos',
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
})
export class Eventos {
  private readonly eventosService = inject(EventosService);
  private readonly localizacoesService = inject(LocaizacoesService);

  readonly perPage = 12;

  readonly searchQuery    = signal('');
  readonly dateFrom       = signal('');
  readonly dateTo         = signal('');
  readonly selectedLoc    = signal('');
  readonly currentPage    = signal(1);

  private readonly allEventos = toSignal(
    this.eventosService.listar().pipe(catchError(() => of([] as EventoItem[])))
  );

  private readonly allLocations = toSignal(
    this.localizacoesService.listar().pipe(catchError(() => of([])))
  );

  readonly loading = computed(() => this.allEventos() === undefined);

  readonly locations = computed(() =>
    (this.allLocations() ?? []).map(l => l.name)
  );

  readonly filtered = computed(() => {
    const all  = this.allEventos() ?? [];
    const q    = this.searchQuery().trim().toLowerCase();
    const from = this.dateFrom();
    const to   = this.dateTo();
    const loc  = this.selectedLoc();

    return all.filter(e => {
      const eEnd = e.end_date ?? e.event_date;
      if (q   && !e.title.toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q)) return false;
      if (from && eEnd < from)       return false;
      if (to   && e.event_date > to) return false;
      if (loc  && e.location !== loc) return false;
      return true;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.perPage)));

  readonly paginated = computed(() => {
    const page  = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.perPage;
    return this.filtered().slice(start, start + this.perPage);
  });

  readonly hasFilters = computed(() =>
    !!this.searchQuery() || !!this.dateFrom() || !!this.dateTo() || !!this.selectedLoc()
  );

  goTo(page: number): void {
    const clamped = Math.max(1, Math.min(page, this.totalPages()));
    this.currentPage.set(clamped);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.selectedLoc.set('');
    this.currentPage.set(1);
  }

  resetPage(): void {
    this.currentPage.set(1);
  }

  fmtDate(d: string): string {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  fmtDateRange(e: EventoItem): string {
    if (!e.end_date) return this.fmtDate(e.event_date);
    const [, ms, ds] = e.event_date.split('-');
    const [, me, de] = e.end_date.split('-');
    return `${ds}/${ms} – ${de}/${me}`;
  }

  fmtTime(t: string): string {
    if (!t) return '';
    const parts = t.split(':');
    return `${parts[0].padStart(2,'0')}:${(parts[1] ?? '00').padStart(2,'0')}`;
  }
}
