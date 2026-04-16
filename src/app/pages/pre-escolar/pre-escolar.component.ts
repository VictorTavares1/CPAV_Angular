import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-pre-escolar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './pre-escolar.component.html',
    styleUrls: ['./pre-escolar.component.css']
})
export class PreEscolarComponent {

    activeTab: string = 'edificio1';

    lightboxVisible = false;
    lightboxSrc = '';
    lightboxTitle = '';

    buildings = [
        {
            key: 'edificio1',
            tab: 'Centro Social Paroquial de São Lourenço de Alhos Vedros',
            name: 'Centro Social Paroquial de São Lourenço de Alhos Vedros',
            desc: 'Instalações dedicadas ao Pré-Escolar, com espaços pedagógicos especialmente concebidos para crianças dos 3 aos 6 anos, promovendo o desenvolvimento integral em ambiente seguro e estimulante.',
            table: [
                { label: 'Designação', value: 'Centro Social Paroquial de São Lourenço de Alhos Vedros' },
                { label: 'Morada', value: 'Largo da Igreja, 2860-037 Alhos Vedros' },
                { label: 'Telefone (Rede Fixa)', value: '212 043 425' },
                { label: 'Telemóvel', value: '961 420 058' },
                { label: 'Email', value: 'cspslav@hotmail.com', href: 'mailto:cspslav@hotmail.com' }
            ],
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778.944216451896!2d-9.028796839989411!3d38.65401067569261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937eeaf8216b5%3A0x92c3f1ba1e17b49d!2sJardim%20De%20Inf%C3%A2ncia!5e0!3m2!1spt-PT!2spt!4v1769898504085!5m2!1spt-PT!2spt',
            note: null
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
                { label: 'Email', value: 'csnsp@hotmail.com', href: 'mailto:csnsp@hotmail.com' }
            ],
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt',
            note: 'Este equipamento também inclui resposta de C.A.T.L. e Serviço de Apoio Domiciliário (SAD).'
        }
    ];

    constructor(private sanitizer: DomSanitizer) { }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    setTab(key: string): void {
        this.activeTab = key;
    }

    openLightbox(src: string, title: string): void {
        this.lightboxSrc = src;
        this.lightboxTitle = title;
        this.lightboxVisible = true;
    }

    closeLightbox(): void {
        this.lightboxVisible = false;
    }
}