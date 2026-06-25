import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageContentsService } from '../../services/page-contents.service';
import { FacilitiesService, FacilityServiceWithFacility } from '../../services/facilities.service';

interface GalleryImage {
  file: string;
  title: string;
  alt: string;
}

interface BuildingRow {
  label: string;
  value: string;
  href?: string;
}

interface Building {
  key: string;
  tab: string;
  name: string;
  desc: string;
  table: BuildingRow[];
  mapUrl: SafeResourceUrl;
  note: string | null;
  images: GalleryImage[];
}

const MAP_URLS: Record<string, string> = {
  'Centro Social Nossa Senhora de Belém':
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d327.52906520139584!2d-9.022762042504635!3d38.648899696026795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa947aaaab%3A0x24c9202ad3af83b7!2sR.%20Miguel%20Torga%2020%2C%202860-240%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907475590!5m2!1spt-PT!2spt',
};

const GALLERY: Record<string, GalleryImage[]> = {
  'Centro Social Nossa Senhora de Belém': [
    { file: 'nossaSenhoraBelem1.jpg', title: 'Entrada do Centro Social', alt: 'Entrada do Centro Social Nossa Senhora de Belém' },
    { file: 'nossaSenhoraBelem2.jpg', title: 'Sala de atividades', alt: 'Sala de atividades do Centro Social Nossa Senhora de Belém' },
    { file: 'nossaSenhoraBelem3.jpg', title: 'Refeitório', alt: 'Refeitório do Centro Social Nossa Senhora de Belém' },
    { file: 'nossaSenhoraBelem4.jpg', title: 'Serviço de transporte', alt: 'Viaturas de transporte do Centro Social Nossa Senhora de Belém' },
  ],
};

@Component({
  selector: 'app-nossa-senhora-belem',
  standalone: true,
  imports: [],
  templateUrl: './nossa-senhora-belem.component.html',
  styleUrls: ['./nossa-senhora-belem.component.css']
})
export class NossaSenhoraBelemComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  descricaoGeral = 'Localizado na Urbanização Vila Rosa, o Centro Social Nossa Senhora de Belém é uma resposta social da instituição que visa apoiar a comunidade local através de diversos serviços adaptados às necessidades das famílias de Alhos Vedros.';
  publicoAlvo = 'Famílias, crianças, jovens, adultos e idosos da comunidade';
  horario = 'Segunda a Sexta-feira, das 9h00 às 17h00';
  servicosDisponiveis = 'Salas polivalentes, refeitório, apoio social, atividades comunitárias';
  equipa = 'Técnicos sociais, auxiliares, voluntários';
  objetivos = 'Promover a inclusão social, apoiar famílias vulneráveis, fomentar o desenvolvimento comunitário';
  servicosAtividadesHtml = '';
  inscricoesHtml = '';
  faqHtml = '';

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.pageContentsService.listar('nossa-senhora-belem').subscribe(rows => {
      const m = new Map(rows.map(r => [r.section_key, r.content_value]));
      if (m.get('descricao_geral'))       this.descricaoGeral         = m.get('descricao_geral')!;
      if (m.get('publico_alvo'))           this.publicoAlvo            = m.get('publico_alvo')!;
      if (m.get('horario'))                this.horario                = m.get('horario')!;
      if (m.get('servicos_disponiveis'))   this.servicosDisponiveis    = m.get('servicos_disponiveis')!;
      if (m.get('equipa'))                 this.equipa                 = m.get('equipa')!;
      if (m.get('objetivos'))              this.objetivos              = m.get('objetivos')!;
      if (m.get('servicos_atividades'))    this.servicosAtividadesHtml = m.get('servicos_atividades')!;
      if (m.get('inscricoes'))             this.inscricoesHtml         = m.get('inscricoes')!;
      if (m.get('faq'))                    this.faqHtml                = m.get('faq')!;
      this.cdr.markForCheck();
    });

    this.facilitiesService.listarPorServico('nossa-senhora-belem').subscribe(rows => {
      if (rows.length > 0) {
        this.buildings = rows.map((fs, i) => this.toBuilding(fs, i));
        if (this.buildings.length > 0) this.activeTab = this.buildings[0].key;
      } else {
        this.buildings = this.buildFallback();
      }
      this.cdr.markForCheck();
    });
  }

  private toBuilding(fs: FacilityServiceWithFacility, index: number): Building {
    const table: BuildingRow[] = [{ label: 'Designação', value: fs.name }];
    if (fs.address) table.push({ label: 'Morada', value: fs.address });
    if (fs.tel)     table.push({ label: 'Telefone (Rede Fixa)', value: fs.tel });
    if (fs.mobile)  table.push({ label: 'Telemóvel', value: fs.mobile });
    if (fs.email)   table.push({ label: 'Email', value: fs.email, href: `mailto:${fs.email}` });

    return {
      key:    `edificio${index + 1}`,
      tab:    fs.name,
      name:   fs.name,
      desc:   fs.description ?? '',
      note:   fs.note,
      table,
      mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(MAP_URLS[fs.name] ?? ''),
      images: GALLERY[fs.name] ?? [],
    };
  }

  private buildFallback(): Building[] {
    return Object.keys(MAP_URLS).map((name, i) => ({
      key:    `edificio${i + 1}`,
      tab:    name,
      name,
      desc:   '',
      note:   null,
      table:  [{ label: 'Designação', value: name }],
      mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(MAP_URLS[name]),
      images: GALLERY[name] ?? [],
    }));
  }

  setTab(key: string): void { this.activeTab = key; }

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
