import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { PageContentsService, PageContentItem } from '../../services/page-contents.service';

interface ImagemGaleria {
  src: string;
  title: string;
}

@Component({
  selector: 'app-sobre-nos',
  imports: [],
  templateUrl: './sobre-nos.html',
  styleUrl: './sobre-nos.css',
})
export class SobreNos implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  lightbox: ImagemGaleria | null = null;

  quemSomos = '';
  missao = '';
  visao = '';
  valores = '';

  ngOnInit(): void {
    this.pageContentsService.listar('sobre-nos').subscribe(items => {
      const map: Record<string, string> = {};
      items.forEach((i: PageContentItem) => map[i.section_key] = i.content_value);
      this.quemSomos = map['quem_somos'] ?? '';
      this.missao    = map['missao'] ?? '';
      this.visao     = map['visao'] ?? '';
      this.valores   = map['valores'] ?? '';
      this.cdr.markForCheck();
    });
  }

  readonly galeria: ImagemGaleria[] = [
    { src: '/images/sobre/atividades-educativas.jpg', title: 'Atividades educativas' },
    { src: '/images/sobre/apoio-comunidade.jpg', title: 'Apoio à comunidade' },
    { src: '/images/sobre/trabalho-equipa.jpg', title: 'Trabalho em equipa' },
    { src: '/images/sobre/acompahamento-cuidado.jpg', title: 'Acompanhamento e Cuidado' },
  ];

  openLightbox(img: ImagemGaleria): void {
    this.lightbox = img;
  }

  closeLightbox(): void {
    this.lightbox = null;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
