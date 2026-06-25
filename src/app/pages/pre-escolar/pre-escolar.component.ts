import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageContentsService } from '../../services/page-contents.service';
import { FacilitiesService, FacilityServiceWithFacility } from '../../services/facilities.service';

interface GalleryImage {
    file: string;
    title: string;
    alt: string;
}

interface Building {
    key: string;
    tab: string;
    name: string;
    desc: string;
    table: { label: string; value: string; href?: string }[];
    mapSrc: SafeResourceUrl;
    note: string | null;
    images: GalleryImage[];
}

const MAP_URLS: Record<string, string> = {
    'Sede Principal':
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778.944216451896!2d-9.028796839989411!3d38.65401067569261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937eeaf8216b5%3A0x92c3f1ba1e17b49d!2sJardim%20De%20Inf%C3%A2ncia!5e0!3m2!1spt-PT!2spt!4v1769898504085!5m2!1spt-PT!2spt',
    'Centro Social Nossa Senhora da Paz':
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt',
};

const GALLERY: Record<string, GalleryImage[]> = {
    'Sede Principal': [
        { file: 'preEscolar1.jpg', title: 'Sala do Pré-Escolar', alt: 'Sala do pré-escolar com mesas e materiais pedagógicos.' },
        { file: 'preEscolar2.jpg', title: 'Sala de Refeitório', alt: 'Sala de Refeitório do pré-escolar.' },
        { file: 'preEscolar3.jpg', title: 'Espaço exterior', alt: 'Estabelecimento pré-escolar' },
        { file: 'preEscolar4.jpg', title: 'Jardim de Infância', alt: 'Identificação do Jardim de Infância do Centro Social Paroquial de São Lourenço de Alhos Vedros' },
    ],
    'Centro Social Nossa Senhora da Paz': [
        { file: 'preEscolar5.jpg', title: 'Espaço exterior', alt: 'Espaço exterior do Jardim de Infância' },
        { file: 'preEscolar6.jpg', title: 'Sala de atividades', alt: 'Sala de atividades do Pré-Escolar' },
        { file: 'preEscolar7.jpg', title: 'Refeitório', alt: 'Refeitório do Jardim de Infância' },
        { file: 'preEscolar8.jpg', title: 'Viatura Serviço de Apoio Domiciliário', alt: 'Viatura do Centro Social Paroquial de São Lourenço de Alhos Vedros' },
    ],
};

const FALLBACK_BUILDINGS: Building[] = [
    {
        key: 'edificio1',
        tab: 'Sede Principal',
        name: 'Sede Principal',
        desc: 'Instalações dedicadas ao Pré-Escolar, com espaços pedagógicos especialmente concebidos para crianças dos 3 aos 6 anos, promovendo o desenvolvimento integral em ambiente seguro e estimulante.',
        table: [
            { label: 'Designação', value: 'Sede Principal' },
            { label: 'Morada', value: 'Largo da Igreja, 2860-037 Alhos Vedros' },
            { label: 'Telefone (Rede Fixa)', value: '212 043 425' },
            { label: 'Telemóvel', value: '961 420 058' },
            { label: 'Email', value: 'cspslav@hotmail.com', href: 'mailto:cspslav@hotmail.com' },
        ],
        mapSrc: '' as unknown as SafeResourceUrl,
        note: null,
        images: GALLERY['Sede Principal'],
    },
    {
        key: 'edificio2',
        tab: 'Centro Social Nossa Senhora da Paz',
        name: 'Centro Social Nossa Senhora da Paz',
        desc: 'Equipamento localizado na Quinta da Fonte da Prata, com resposta de Pré-Escolar integrada num contexto comunitário mais amplo, oferecendo serviços complementares às famílias.',
        table: [
            { label: 'Designação', value: 'Centro Social Nossa Senhora da Paz' },
            { label: 'Morada', value: 'Bairro da Quinta da Fonte da Prata, Rua Fernando Pessoa, n.º 10, Bloco Q, 2860-071 Alhos Vedros' },
            { label: 'Telefone (Rede Fixa)', value: '212 892 676' },
            { label: 'Telemóvel', value: '961 420 037' },
            { label: 'Email', value: 'csnsp@hotmail.com', href: 'mailto:csnsp@hotmail.com' },
        ],
        mapSrc: '' as unknown as SafeResourceUrl,
        note: 'Este equipamento também inclui resposta de C.A.T.L. e Serviço de Apoio Domiciliário (SAD).',
        images: GALLERY['Centro Social Nossa Senhora da Paz'],
    },
];

@Component({
    selector: 'app-pre-escolar',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './pre-escolar.component.html',
    styleUrls: ['./pre-escolar.component.css']
})
export class PreEscolarComponent implements OnInit {
    private readonly pageContentsService = inject(PageContentsService);
    private readonly facilitiesService = inject(FacilitiesService);
    private readonly cdr = inject(ChangeDetectorRef);

    descricaoGeral = 'A nossa instituição assegura a resposta de Pré-Escolar em dois equipamentos distintos, promovendo o desenvolvimento integral da criança através de uma pedagogia ativa, lúdica e centrada nas necessidades individuais de cada criança.';
    publicoAlvo = 'Crianças dos 3 aos 6 anos';
    horario = 'Das 7h30 às 19h30 (segunda a sexta-feira)';
    componentes = 'Atividades pedagógicas, refeições (pequeno-almoço, almoço e lanche), recreio, descanso';
    equipa = 'Educadoras(es) de infância, auxiliares de ação educativa, técnicos especializados';
    objetivos = 'Promover autonomia, socialização, desenvolvimento psicomotor e aprendizagens significativas';
    projetoPedagogicoHtml = '';
    inscricoesHtml = '';
    faqHtml = '';

    activeTab = 'edificio1';
    lightboxVisible = false;
    lightboxSrc = '';
    lightboxTitle = '';

    buildings: Building[] = FALLBACK_BUILDINGS;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.pageContentsService.listar('pre-escolar').subscribe(rows => {
            const m = new Map(rows.map(r => [r.section_key, r.content_value]));
            if (m.get('descricao_geral'))      this.descricaoGeral        = m.get('descricao_geral')!;
            if (m.get('publico_alvo'))          this.publicoAlvo           = m.get('publico_alvo')!;
            if (m.get('horario'))               this.horario               = m.get('horario')!;
            if (m.get('componentes'))           this.componentes           = m.get('componentes')!;
            if (m.get('equipa'))                this.equipa                = m.get('equipa')!;
            if (m.get('objetivos'))             this.objetivos             = m.get('objetivos')!;
            if (m.get('projeto_pedagogico'))    this.projetoPedagogicoHtml = m.get('projeto_pedagogico')!;
            if (m.get('inscricoes'))            this.inscricoesHtml        = m.get('inscricoes')!;
            if (m.get('faq'))                   this.faqHtml               = m.get('faq')!;
            this.cdr.markForCheck();
        });

        this.facilitiesService.listarPorServico('pre-escolar').subscribe(rows => {
            if (rows.length > 0) {
                this.buildings = rows.map((fs, i) => this.toBuilding(fs, i));
                if (this.buildings.length > 0) {
                    this.activeTab = this.buildings[0].key;
                }
            }
            this.cdr.markForCheck();
        });
    }

    private toBuilding(fs: FacilityServiceWithFacility, index: number): Building {
        const mapRaw = MAP_URLS[fs.name] ?? '';
        const table: { label: string; value: string; href?: string }[] = [
            { label: 'Designação', value: fs.name },
        ];
        if (fs.address) table.push({ label: 'Morada', value: fs.address });
        if (fs.tel)     table.push({ label: 'Telefone (Rede Fixa)', value: fs.tel });
        if (fs.mobile)  table.push({ label: 'Telemóvel', value: fs.mobile });
        if (fs.email)   table.push({ label: 'Email', value: fs.email, href: `mailto:${fs.email}` });

        return {
            key:    `edificio${index + 1}`,
            tab:    fs.name,
            name:   fs.name,
            desc:   fs.description ?? '',
            table,
            mapSrc: this.sanitizer.bypassSecurityTrustResourceUrl(mapRaw),
            note:   fs.note,
            images: GALLERY[fs.name] ?? [],
        };
    }

    setTab(key: string): void { this.activeTab = key; }

    openLightbox(src: string, title: string): void {
        this.lightboxSrc = src;
        this.lightboxTitle = title;
        this.lightboxVisible = true;
    }

    closeLightbox(): void { this.lightboxVisible = false; }
}
