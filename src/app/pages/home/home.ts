import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageContentsService, PageContentItem } from '../../services/page-contents.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { Noticias, NoticiaItem } from '../../services/noticias';
import { ApiConfigService } from '../../services/api-config.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly noticiasService = inject(Noticias);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly uploadsUrl = inject(ApiConfigService).uploadsUrl;

  heroTitle = 'Centro Paroquial de São Lourenço de Alhos Vedros';
  heroDescription = '';
  servicosDescription = '';
  ultimasNoticias: NoticiaItem[] = [];

  ngOnInit(): void {
    this.pageContentsService.listar('home').subscribe(items => {
      const map: Record<string, string> = {};
      items.forEach((i: PageContentItem) => map[i.section_key] = i.content_value);
      if (map['hero_title']) this.heroTitle = map['hero_title'];
      if (map['hero_description']) this.heroDescription = map['hero_description'];
      if (map['servicos_description']) this.servicosDescription = map['servicos_description'];
      this.cdr.markForCheck();
    });

    this.noticiasService.listar().subscribe(noticias => {
      this.ultimasNoticias = (noticias ?? []).slice(0, 3);
      this.cdr.markForCheck();
    });
  }

  excerpt(html: string): string {
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length > 120 ? text.slice(0, 120) + '…' : text;
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
