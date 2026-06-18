import { Component, computed, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Noticias as NoticiasService, NoticiaItem } from '../../services/noticias';
import { ApiConfigService } from '../../services/api-config.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

declare const bootstrap: any;

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

  constructor() {
    effect(() => {
      const items = this.filtered();
      if (items.some(n => n.images && n.images.length > 1)) {
        Promise.resolve().then(() => {
          document.querySelectorAll('[data-bs-ride="carousel"]').forEach(el => {
            bootstrap?.Carousel?.getOrCreateInstance(el);
          });
        });
      }
    });
  }

  private readonly allNoticias = toSignal(
    this.noticiasService.listar().pipe(catchError(() => of([] as NoticiaItem[])))
  );

  readonly loading = computed(() => this.allNoticias() === undefined);

  readonly filtered = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.allNoticias() ?? [];
    if (!q) return all;
    return all.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  });

  clearSearch(): void {
    this.searchQuery.set('');
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
