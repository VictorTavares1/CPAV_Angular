import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { PageContentsService } from '../../services/page-contents.service';

@Component({
  selector: 'app-po-apmc',
  standalone: true,
  imports: [],
  templateUrl: './po-apmc.component.html',
  styleUrls: ['./po-apmc.component.css']
})
export class PoApmcComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  descricaoGeral = 'O Programa Operacional de Apoio às Pessoas Mais Carenciadas pretende ser um instrumento de combate à pobreza e à exclusão social em Portugal.';
  oQueEParagrafo = 'O PO APMC é um programa europeu cofinanciado pelo Fundo de Auxílio Europeu às Pessoas Mais Carenciadas (FEAD), que apoia a distribuição de alimentos e bens de consumo básico a pessoas em situação de carência.';
  objetivosHtml = '';
  comoFuncionaHtml = '';
  comoSolicitarHtml = '';
  faqHtml = '';

  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  ngOnInit(): void {
    this.pageContentsService.listar('po-apmc').subscribe(rows => {
      const m = new Map(rows.map(r => [r.section_key, r.content_value]));
      if (m.get('descricao_geral'))    this.descricaoGeral  = m.get('descricao_geral')!;
      if (m.get('o_que_e_paragrafo'))  this.oQueEParagrafo  = m.get('o_que_e_paragrafo')!;
      if (m.get('objetivos'))          this.objetivosHtml   = m.get('objetivos')!;
      if (m.get('como_funciona'))      this.comoFuncionaHtml = m.get('como_funciona')!;
      if (m.get('como_solicitar'))     this.comoSolicitarHtml = m.get('como_solicitar')!;
      if (m.get('faq'))                this.faqHtml         = m.get('faq')!;
      this.cdr.markForCheck();
    });
  }

  openLightbox(src: string, title: string): void {
    this.lightboxImg = src;
    this.lightboxTitle = title;
    this.lightboxVisible = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxVisible = false;
    this.lightboxImg = '';
    this.lightboxTitle = '';
    document.body.style.overflow = '';
  }
}
