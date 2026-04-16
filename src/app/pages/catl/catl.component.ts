import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface BuildingRow {
    label: string;
    value: string;
    isHtml?: boolean;
}

interface Building {
    key: string;
    tab: string;
    name: string;
    desc: string;
    table: BuildingRow[];
    mapUrl: SafeResourceUrl;
    images: string[];
}

@Component({
    selector: 'app-catl',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './catl.component.html',
    styleUrls: ['./catl.component.css']
})
export class CatlComponent {

    activeTab = 'edificio1';

    buildings: Building[];

    constructor(private sanitizer: DomSanitizer) {
        this.buildings = [
            {
                key: 'edificio1',
                tab: 'Centro Social Nossa Senhora da Paz',
                name: 'Centro Social Nossa Senhora da Paz',
                desc: 'Equipamento localizado na Quinta da Fonte da Prata, com espaço dedicado ao C.A.T.L. para crianças do 1º ciclo.',
                table: [
                    { label: 'Designação', value: 'Centro Social Nossa Senhora da Paz' },
                    { label: 'Morada', value: 'Bairro da Quinta da Fonte da Prata, Rua Fernando Pessoa, n.º 10, Bloco Q, 2860-071 Alhos Vedros' },
                    { label: 'Telefone (Rede Fixa)', value: '212 892 676' },
                    { label: 'Telemóvel', value: '961 420 037' },
                    { label: 'Email', value: '<a href="mailto:csnsp@hotmail.com">csnsp@hotmail.com</a>', isHtml: true },
                ],
                mapUrl: this.getSafeUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt'),
                images: []
            },
            {
                key: 'edificio2',
                tab: 'Centro Social Nossa Senhora de Belém',
                name: 'Centro Social Nossa Senhora de Belém',
                desc: 'Equipamento localizado na Urbanização Vila Rosa, com sala polivalente e refeitório para atividades do C.A.T.L.',
                table: [
                    { label: 'Designação', value: 'Centro Social Nossa Senhora de Belém' },
                    { label: 'Morada', value: 'Rua Miguel Torga, 20 – A, Urbanização Vila Rosa, 2860-204 Alhos Vedros' },
                    { label: 'Telefone (Rede Fixa)', value: '212 093 035' },
                    { label: 'Telemóvel', value: '961 420 045' },
                    { label: 'Email', value: '<a href="mailto:csnb@hotmail.com">csnb@hotmail.com</a>', isHtml: true },
                ],
                mapUrl: this.getSafeUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d327.52906520139584!2d-9.022762042504635!3d38.648899696026795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa947aaaab%3A0x24c9202ad3af83b7!2sR.%20Miguel%20Torga%2020%2C%202860-240%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907475590!5m2!1spt-PT!2spt'),
                images: []
            },
            {
                key: 'edificio3',
                tab: 'Sala Arco-Íris',
                name: 'Sala Arco-Íris',
                desc: 'Equipamento dedicado ao apoio escolar e atividades de tempos livres, localizado na Urbanização Bela Rosa.',
                table: [
                    { label: 'Designação', value: 'Sala Arco-Íris – Apoio ao Estudo' },
                    { label: 'Morada', value: 'Praça Almada Negreiros Loja 6, Urbanização Bela Rosa 2860-115 Alhos Vedros' },
                    { label: 'Telefone Geral', value: '211 628 848' },
                    { label: 'Email', value: '<a href="mailto:arcoiris@cspslav.pt">arcoiris@cspslav.pt</a>', isHtml: true },
                ],
                mapUrl: this.getSafeUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.8381877360331!2d-9.0225692889697!3d38.64861950997912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa9158d949%3A0x14e65847d550d2bd!2sCentro%20Social%20e%20Paroquial%20de%20S.%20Louren%C3%A7o%20de%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907260549!5m2!1spt-PT!2spt'),
                images: []
            }
        ];
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    setTab(key: string): void {
        this.activeTab = key;
    }

    // Lightbox
    lightboxVisible = false;
    lightboxImg = '';
    lightboxTitle = '';

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