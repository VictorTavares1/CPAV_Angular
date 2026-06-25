import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Noticias as NoticiasService, NoticiaItem } from '../../services/noticias';
import { ApiConfigService } from '../../services/api-config.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-noticias',
  imports: [FormsModule, RouterLink, ScrollRevealDirective],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css',
})
export class Noticias {
  private readonly noticiasService = inject(NoticiasService);
  protected readonly uploadsUrl = inject(ApiConfigService).uploadsUrl;

  readonly searchQuery = signal('');
  readonly dateFrom    = signal('');
  readonly dateTo      = signal('');
  readonly currentPage = signal(1);
  private readonly PAGE_SIZE = 9;

  // Carrossel leve (sem Bootstrap): índice da imagem visível por notícia.
  private readonly imgIndex = signal<Record<number, number>>({});

  imgIndexOf(id: number): number {
    return this.imgIndex()[id] ?? 0;
  }

  private setImg(id: number, idx: number, total: number): void {
    const i = ((idx % total) + total) % total; // wrap circular
    this.imgIndex.update(m => ({ ...m, [id]: i }));
  }

  prevImg(event: Event, n: NoticiaItem): void {
    event.preventDefault();
    event.stopPropagation();
    const total = n.images?.length ?? 0;
    if (total > 1) this.setImg(n.id, this.imgIndexOf(n.id) - 1, total);
  }

  nextImg(event: Event, n: NoticiaItem): void {
    event.preventDefault();
    event.stopPropagation();
    const total = n.images?.length ?? 0;
    if (total > 1) this.setImg(n.id, this.imgIndexOf(n.id) + 1, total);
  }

  goToImg(event: Event, n: NoticiaItem, i: number): void {
    event.preventDefault();
    event.stopPropagation();
    const total = n.images?.length ?? 0;
    if (total > 1) this.setImg(n.id, i, total);
  }

  private readonly allNoticias = toSignal(
    this.noticiasService.listar().pipe(catchError(() => of([] as NoticiaItem[])))
  );

  readonly loading = computed(() => this.allNoticias() === undefined);

  readonly filtered = computed(() => {
    const q    = this.searchQuery().trim().toLowerCase();
    const from = this.dateFrom();
    const to   = this.dateTo();
    const all  = this.allNoticias() ?? [];
    return all.filter(n => {
      if (q && !n.title.toLowerCase().includes(q) && !n.content.toLowerCase().includes(q)) return false;
      if (n.dateHour) {
        const d = n.dateHour.substring(0, 10);
        if (from && d < from) return false;
        if (to   && d > to)   return false;
      }
      return true;
    });
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.PAGE_SIZE;
    return this.filtered().slice(start, start + this.PAGE_SIZE);
  });

  readonly totalPages = computed(() => Math.ceil(this.filtered().length / this.PAGE_SIZE));

  readonly pageNumbers = computed((): number[] => {
    const total = this.totalPages();
    const cur   = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    if (cur > 3)           pages.push(-1);
    for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p);
    if (cur < total - 2)   pages.push(-1);
    pages.push(total);
    return pages;
  });

  readonly hasFilters = computed(() =>
    !!this.searchQuery() || !!this.dateFrom() || !!this.dateTo()
  );

  setSearch(v: string): void   { this.searchQuery.set(v); this.currentPage.set(1); }
  setDateFrom(v: string): void { this.dateFrom.set(v);    this.currentPage.set(1); }
  setDateTo(v: string): void   { this.dateTo.set(v);      this.currentPage.set(1); }
  goTo(page: number): void     { this.currentPage.set(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  clearFilters(): void {
    this.searchQuery.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  excerpt(html: string, len = 160): string {
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return text.length <= len ? text : text.substring(0, len) + '…';
  }

  fmtDate(dateHour: string | undefined): string {
    if (!dateHour) return '';
    const d = new Date(dateHour);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-PT');
  }
}
