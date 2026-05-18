import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageContentsService, PageContentItem } from '../../services/page-contents.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  heroTitle = 'Centro Paroquial de São Lourenço de Alhos Vedros';
  heroDescription = '';
  servicosDescription = '';

  ngOnInit(): void {
    this.pageContentsService.listar('home').subscribe(items => {
      const map: Record<string, string> = {};
      items.forEach((i: PageContentItem) => map[i.section_key] = i.content_value);
      if (map['hero_title']) this.heroTitle = map['hero_title'];
      if (map['hero_description']) this.heroDescription = map['hero_description'];
      if (map['servicos_description']) this.servicosDescription = map['servicos_description'];
      this.cdr.markForCheck();
    });
  }
}
