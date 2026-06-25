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
  note: string | null;
  table: BuildingRow[];
  mapUrl: SafeResourceUrl;
  images: GalleryImage[];
}

const MAP_URLS: Record<string, string> = {
  'Centro Social Nossa Senhora da Paz':
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt',
};

const GALLERY: Record<string, GalleryImage[]> = {
  'Centro Social Nossa Senhora da Paz': [
    { file: 'sad1.jpg', title: 'Espaço exterior', alt: 'Espaço exterior do SAD' },
    { file: 'sad2.jpg', title: 'Sala de atividades', alt: 'Sala de atividades do SAD' },
    { file: 'sad3.jpg', title: 'Refeitório', alt: 'Refeitório do SAD' },
    { file: 'sad4.jpg', title: 'Viatura Serviço de Apoio Domiciliário', alt: 'Viatura do Centro Social Paroquial de São Lourenço de Alhos Vedros' },
  ],
};

@Component({
  selector: 'app-sad',
  standalone: true,
  templateUrl: './sad.component.html',
  styleUrls: ['./sad.component.css']
})
export class SadComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  descricaoGeral = 'O S.A.D. é uma resposta social que visa apoiar pessoas idosas ou com dependência, garantindo-lhes cuidados personalizados no seu ambiente familiar, prevenindo situações de isolamento e promovendo o envelhecimento ativo e com dignidade.';
  publicoAlvo = 'Idosos (a partir dos 65 anos) e pessoas com dependência física ou cognitiva';
  horario = 'Segunda a Sexta-feira: 8h00 às 20h00 e Sábados: 9h00 às 13h00 (serviço de urgência)';
  areaIntervencao = 'Alhos Vedros e freguesias limítrofes do concelho da Moita';
  equipa = 'Assistentes operacionais, auxiliares de geriatria, coordenador técnico, psicólogo (apoio)';
  objetivos = 'Manter as pessoas no seu ambiente familiar, prevenir institucionalização, promover autonomia e qualidade de vida';
  servicosPrestadosHtml = '';
  metodologiaHtml = '';
  admissaoHtml = '';
  faqHtml = '';

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.pageContentsService.listar('sad').subscribe(rows => {
      const m = new Map(rows.map(r => [r.section_key, r.content_value]));
      if (m.get('descricao_geral'))    this.descricaoGeral        = m.get('descricao_geral')!;
      if (m.get('publico_alvo'))        this.publicoAlvo           = m.get('publico_alvo')!;
      if (m.get('horario'))             this.horario               = m.get('horario')!;
      if (m.get('area_intervencao'))    this.areaIntervencao       = m.get('area_intervencao')!;
      if (m.get('equipa'))              this.equipa                = m.get('equipa')!;
      if (m.get('objetivos'))           this.objetivos             = m.get('objetivos')!;
      if (m.get('servicos_prestados'))  this.servicosPrestadosHtml = m.get('servicos_prestados')!;
      if (m.get('metodologia'))         this.metodologiaHtml       = m.get('metodologia')!;
      if (m.get('admissao'))            this.admissaoHtml          = m.get('admissao')!;
      if (m.get('faq'))                 this.faqHtml               = m.get('faq')!;
      this.cdr.markForCheck();
    });

    this.facilitiesService.listarPorServico('sad').subscribe(rows => {
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
    table.push({ label: 'Área de Intervenção', value: 'Alhos Vedros e áreas limítrofes' });

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
