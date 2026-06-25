import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageContentsService } from '../../services/page-contents.service';

@Component({
  selector: 'app-como-ajudar',
  imports: [RouterLink],
  templateUrl: './como-ajudar.html',
  styleUrl: './como-ajudar.css'
})
export class ComoAjudar implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  introTitulo    = 'Faça a Diferença';
  donativosLista = '';
  irsConsignacao = '';
  generos        = '';
  voluntariado   = '';
  parcerias      = '';
  faq            = '';

  ngOnInit(): void {
    this.pageContentsService.listar('como-ajudar').subscribe(items => {
      const map = new Map(items.map(i => [i.section_key, i.content_value]));
      this.introTitulo    = map.get('intro_titulo')    || this.introTitulo;
      this.donativosLista = map.get('donativos_lista') || '';
      this.irsConsignacao = map.get('irs_consignacao') || '';
      this.generos        = map.get('generos')         || '';
      this.voluntariado   = map.get('voluntariado')    || '';
      this.parcerias      = map.get('parcerias')       || '';
      this.faq            = map.get('faq')             || '';
      this.cdr.markForCheck();
    });
  }
}
