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
  'Sala Arco-Íris':
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.8381877360331!2d-9.0225692889697!3d38.64861950997912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa9158d949%3A0x14e65847d550d2bd!2sCentro%20Social%20e%20Paroquial%20de%20S.%20Louren%C3%A7o%20de%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907260549!5m2!1spt-PT!2spt',
};

const GALLERY: Record<string, GalleryImage[]> = {
  'Sala Arco-Íris': [
    { file: 'salaArcoIris1.jpg', title: 'Espaço exterior', alt: 'Espaço exterior da Sala Arco-Íris' },
    { file: 'salaArcoIris2.jpg', title: 'Sala de estudo', alt: 'Sala de estudo da Sala Arco-Íris' },
  ],
};

@Component({
  selector: 'app-apoio-estudo',
  standalone: true,
  imports: [],
  templateUrl: './apoio-estudo.component.html',
  styleUrls: ['./apoio-estudo.component.css']
})
export class ApoioEstudoComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  descricaoGeral = 'A Sala Arco-Íris oferece um espaço estruturado e acolhedor onde crianças e jovens do 1º ao 9º ano podem desenvolver hábitos de estudo, reforçar conhecimentos e superar dificuldades escolares com o acompanhamento de profissionais qualificados.';
  publicoAlvo = 'Crianças e jovens do 1º ao 9º ano de escolaridade';
  horario = 'Segunda a Sexta-feira, das 14h30 às 19h30 (período escolar)';
  disciplinas = 'Português, Matemática, Inglês, Ciências, História, e outras disciplinas';
  equipa = 'Professores, educadores sociais, psicólogos de apoio';
  objetivos = 'Reforçar competências escolares, desenvolver hábitos de estudo, apoiar alunos com dificuldades de aprendizagem';
  metodologiaHtml = '';
  inscricoesHtml = '';
  faqHtml = '';

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.pageContentsService.listar('apoio-estudo').subscribe(rows => {
      const m = new Map(rows.map(r => [r.section_key, r.content_value]));
      if (m.get('descricao_geral'))   this.descricaoGeral  = m.get('descricao_geral')!;
      if (m.get('publico_alvo'))       this.publicoAlvo     = m.get('publico_alvo')!;
      if (m.get('horario'))            this.horario         = m.get('horario')!;
      if (m.get('disciplinas'))        this.disciplinas     = m.get('disciplinas')!;
      if (m.get('equipa'))             this.equipa          = m.get('equipa')!;
      if (m.get('objetivos'))          this.objetivos       = m.get('objetivos')!;
      if (m.get('metodologia'))        this.metodologiaHtml = m.get('metodologia')!;
      if (m.get('inscricoes'))         this.inscricoesHtml  = m.get('inscricoes')!;
      if (m.get('faq'))                this.faqHtml         = m.get('faq')!;
      this.cdr.markForCheck();
    });

    this.facilitiesService.listarPorServico('apoio-estudo').subscribe(rows => {
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
