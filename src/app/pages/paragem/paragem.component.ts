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
  note?: string;
  images: GalleryImage[];
}

const MAP_URLS: Record<string, string> = {
  'Centro Comunitário P.A.R.A.G.E.M':
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt',
};

const GALLERY: Record<string, GalleryImage[]> = {
  'Centro Comunitário P.A.R.A.G.E.M': [
    { file: 'paragem1.jpg', title: 'Fachada do P.A.R.A.G.E.M.', alt: 'Fachada do Centro Comunitário P.A.R.A.G.E.M.' },
    { file: 'paragem2.jpg', title: 'Espaço de convívio', alt: 'Espaço de convívio do P.A.R.A.G.E.M.' },
    { file: 'paragem3.jpg', title: 'Sala multiatividades', alt: 'Sala multiatividades do P.A.R.A.G.E.M.' },
    { file: 'paragem4.jpg', title: 'Zona de lazer', alt: 'Zona de lazer do P.A.R.A.G.E.M.' },
  ],
};

@Component({
  selector: 'app-paragem',
  standalone: true,
  imports: [],
  templateUrl: './paragem.component.html',
  styleUrls: ['./paragem.component.css']
})
export class ParagemComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  descricaoGeral = 'O P.A.R.A.G.E.M (Ponto de Apoio, Recursos e Aprendizagem para Gerações em Movimento) é um centro comunitário que tem como missão criar um espaço de partilha, convívio e desenvolvimento pessoal e social para todas as idades, promovendo a inclusão e a coesão social na comunidade de Alhos Vedros.';
  publicoAlvo = 'Todas as idades (crianças, jovens, adultos, seniores)';
  horario = 'Das 9h00 às 18h00 (segunda a sexta-feira) | Horário variável para atividades específicas';
  atividades = 'Oficinas, workshops, grupos de convívio, atividades intergeracionais, apoio ao estudo, formação';
  equipa = 'Técnicos sociais, animadores socioculturais, monitores especializados, voluntários';
  objetivos = 'Promover a inclusão social, fortalecer os laços comunitários, desenvolver competências pessoais e sociais';
  projetoComunitarioHtml = '';
  areasAtuacaoHtml = '';
  comoParticiparHtml = '';
  parceriasHtml = '';
  faqHtml = '';

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.pageContentsService.listar('paragem').subscribe(rows => {
      const m = new Map(rows.map(r => [r.section_key, r.content_value]));
      if (m.get('descricao_geral'))      this.descricaoGeral         = m.get('descricao_geral')!;
      if (m.get('publico_alvo'))          this.publicoAlvo            = m.get('publico_alvo')!;
      if (m.get('horario'))               this.horario                = m.get('horario')!;
      if (m.get('atividades'))            this.atividades             = m.get('atividades')!;
      if (m.get('equipa'))                this.equipa                 = m.get('equipa')!;
      if (m.get('objetivos'))             this.objetivos              = m.get('objetivos')!;
      if (m.get('projeto_comunitario'))   this.projetoComunitarioHtml = m.get('projeto_comunitario')!;
      if (m.get('areas_atuacao'))         this.areasAtuacaoHtml       = m.get('areas_atuacao')!;
      if (m.get('como_participar'))       this.comoParticiparHtml     = m.get('como_participar')!;
      if (m.get('parcerias'))             this.parceriasHtml          = m.get('parcerias')!;
      if (m.get('faq'))                   this.faqHtml                = m.get('faq')!;
      this.cdr.markForCheck();
    });

    this.facilitiesService.listarPorServico('paragem').subscribe(rows => {
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
      note:   fs.note ?? undefined,
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
      note:   undefined,
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
