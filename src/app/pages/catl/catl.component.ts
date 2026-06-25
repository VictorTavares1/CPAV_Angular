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
    'Centro Social Nossa Senhora de Belém':
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d327.52906520139584!2d-9.022762042504635!3d38.648899696026795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa947aaaab%3A0x24c9202ad3af83b7!2sR.%20Miguel%20Torga%2020%2C%202860-240%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907475590!5m2!1spt-PT!2spt',
    'Sala Arco-Íris':
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.8381877360331!2d-9.0225692889697!3d38.64861950997912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa9158d949%3A0x14e65847d550d2bd!2sCentro%20Social%20e%20Paroquial%20de%20S.%20Louren%C3%A7o%20de%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907260549!5m2!1spt-PT!2spt',
};

const GALLERY: Record<string, GalleryImage[]> = {
    'Centro Social Nossa Senhora da Paz': [
        { file: 'catl1.jpg', title: 'Espaço exterior', alt: 'Espaço exterior do CATL' },
        { file: 'catl2.jpg', title: 'Sala de atividades', alt: 'Sala de atividades do CATL' },
        { file: 'catl3.jpg', title: 'Refeitório', alt: 'Refeitório do CATL' },
        { file: 'catl4.jpg', title: 'Viatura Serviço de Apoio Domiciliário', alt: 'Viatura do Centro Social Paroquial de São Lourenço de Alhos Vedros' },
    ],
    'Centro Social Nossa Senhora de Belém': [
        { file: 'catl5.jpg', title: 'Entrada do CATL', alt: 'Entrada principal do CATL' },
        { file: 'catl6.jpg', title: 'Sala de atividades', alt: 'Sala de atividades do CATL' },
        { file: 'catl7.jpg', title: 'Refeitório', alt: 'Refeitório do CATL' },
        { file: 'catl8.jpg', title: 'Serviço de transporte', alt: 'Viaturas de transporte do CATL' },
    ],
    'Sala Arco-Íris': [
        { file: 'catl9.jpg', title: 'Sala de estudo', alt: 'Sala de estudo e apoio ao CATL' },
        { file: 'catl10.jpg', title: 'Espaço exterior', alt: 'Espaço exterior do CATL' },
    ],
};

@Component({
    selector: 'app-catl',
    standalone: true,
    imports: [],
    templateUrl: './catl.component.html',
    styleUrls: ['./catl.component.css']
})
export class CatlComponent implements OnInit {
    private readonly pageContentsService = inject(PageContentsService);
    private readonly facilitiesService = inject(FacilitiesService);
    private readonly cdr = inject(ChangeDetectorRef);

    descricaoGeral = 'O Centro de Atividades de Tempos Livres oferece um espaço seguro e educativo para crianças fora do horário escolar, combinando apoio pedagógico com atividades recreativas, desportivas e culturais.';
    publicoAlvo = 'Crianças do 1º ciclo (6 aos 10 anos)';
    horario = 'Das 7h30 às 19h30 (período escolar) / Das 8h00 às 19h00 (férias escolares)';
    componentes = 'Apoio ao estudo, refeições, atividades lúdicas, desportivas, expressões artísticas';
    equipa = 'Educadores(as), auxiliares de ação educativa, monitores especializados em atividades de tempos livres';
    objetivos = 'Promover o desenvolvimento social, emocional e cognitivo; apoiar as famílias no cuidado das crianças';
    projetoPedagogicoHtml = '';
    atividadesPrincipaisHtml = '';
    inscricoesHtml = '';
    faqHtml = '';

    activeTab = 'edificio1';
    lightboxVisible = false;
    lightboxImg = '';
    lightboxTitle = '';

    buildings: Building[] = [];

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.pageContentsService.listar('catl').subscribe(rows => {
            const m = new Map(rows.map(r => [r.section_key, r.content_value]));
            if (m.get('descricao_geral'))       this.descricaoGeral           = m.get('descricao_geral')!;
            if (m.get('publico_alvo'))           this.publicoAlvo              = m.get('publico_alvo')!;
            if (m.get('horario'))                this.horario                  = m.get('horario')!;
            if (m.get('componentes'))            this.componentes              = m.get('componentes')!;
            if (m.get('equipa'))                 this.equipa                   = m.get('equipa')!;
            if (m.get('objetivos'))              this.objetivos                = m.get('objetivos')!;
            if (m.get('projeto_pedagogico'))     this.projetoPedagogicoHtml    = m.get('projeto_pedagogico')!;
            if (m.get('atividades_principais'))  this.atividadesPrincipaisHtml = m.get('atividades_principais')!;
            if (m.get('inscricoes'))             this.inscricoesHtml           = m.get('inscricoes')!;
            if (m.get('faq'))                    this.faqHtml                  = m.get('faq')!;
            this.cdr.markForCheck();
        });

        this.facilitiesService.listarPorServico('catl').subscribe(rows => {
            if (rows.length > 0) {
                this.buildings = rows.map((fs, i) => this.toBuilding(fs, i));
                if (this.buildings.length > 0) {
                    this.activeTab = this.buildings[0].key;
                }
            } else {
                this.buildings = this.buildFallback();
            }
            this.cdr.markForCheck();
        });
    }

    private toBuilding(fs: FacilityServiceWithFacility, index: number): Building {
        const mapRaw = MAP_URLS[fs.name] ?? '';
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
            mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(mapRaw),
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
    }

    closeLightbox(): void {
        this.lightboxVisible = false;
        this.lightboxImg = '';
        this.lightboxTitle = '';
    }
}
