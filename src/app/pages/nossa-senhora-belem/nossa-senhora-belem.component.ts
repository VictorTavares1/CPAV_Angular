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
}

@Component({
  selector: 'app-nossa-senhora-belem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nossa-senhora-belem.component.html',
  styleUrls: ['./nossa-senhora-belem.component.css']
})
export class NossaSenhoraBelemComponent {

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[];

  servicos = [
    { titulo: 'Salas Polivalentes', descricao: 'Espaços versáteis para reuniões, workshops, formações e atividades grupais' },
    { titulo: 'Refeitório Comunitário', descricao: 'Serviço de refeições para utentes e atividades do centro' },
    { titulo: 'Apoio Social', descricao: 'Acompanhamento social individualizado e familiar' },
    { titulo: 'Atividades Culturais', descricao: 'Promoção de eventos culturais e artísticos para a comunidade' },
    { titulo: 'Formações', descricao: 'Workshops e cursos de capacitação pessoal e profissional' },
    { titulo: 'Espaço de Convívio', descricao: 'Área de socialização e encontro para a comunidade' },
  ];

  docInscricao = [
    'Cartão de Cidadão do requerente',
    'Comprovativo de residência',
    'Comprovativo de rendimentos (se aplicável)',
    'Documentação específica conforme o serviço pretendido',
  ];

  faq = [
    {
      pergunta: 'Quem pode beneficiar dos serviços deste centro?',
      resposta: 'Os serviços estão disponíveis para toda a comunidade, com prioridade para famílias e indivíduos em situação de vulnerabilidade social ou económica.'
    },
    {
      pergunta: 'É necessário pagar para utilizar os serviços?',
      resposta: 'A maioria dos serviços é gratuita ou tem custos simbólicos. Em alguns casos, podem aplicar-se comparticipações conforme a situação económica do utente.'
    },
    {
      pergunta: 'O centro aceita voluntários?',
      resposta: 'Sim, o centro tem um programa de voluntariado. Interessados podem contactar a instituição para mais informações.'
    },
    {
      pergunta: 'Como posso apoiar este centro social?',
      resposta: 'Através de donativos, voluntariado ou participação nas atividades organizadas. Contacte-nos para saber mais formas de apoio.'
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.buildings = [
      {
        key: 'edificio1',
        tab: 'Centro Social Nossa Senhora de Belém',
        name: 'Centro Social Nossa Senhora de Belém',
        desc: 'Equipamento localizado na Urbanização Vila Rosa, com sala polivalente e refeitório para atividades do C.A.T.L.',
        table: [
          { label: 'Designação', value: 'Centro Social Nossa Senhora de Belém' },
          { label: 'Morada', value: 'Rua Miguel Torga, 20 – A, Urbanização Vila Rosa, 2860-204 Alhos Vedros' },
          { label: 'Telefone (Rede Fixa)', value: '212 093 035' },
          { label: 'Telemóvel', value: '961 420 045' },
          { label: 'Email', value: 'csnb@hotmail.com', isHtml: true },
        ],
        mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d327.52906520139584!2d-9.022762042504635!3d38.648899696026795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa947aaaab%3A0x24c9202ad3af83b7!2sR.%20Miguel%20Torga%2020%2C%202860-240%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907475590!5m2!1spt-PT!2spt'
        ),
      }
    ];
  }

  setTab(key: string): void {
    this.activeTab = key;
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
