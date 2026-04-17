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
  note?: string;
}

@Component({
  selector: 'app-paragem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragem.component.html',
  styleUrls: ['./paragem.component.css']
})
export class ParagemComponent {

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[];

  principios = [
    { titulo: 'Inclusão Social', descricao: 'Criar espaços acessíveis e acolhedores para todas as pessoas, independentemente da sua idade, origem ou condição' },
    { titulo: 'Intergeração', descricao: 'Promover o encontro e a partilha entre diferentes gerações, valorizando os saberes e experiências de cada uma' },
    { titulo: 'Participação Ativa', descricao: 'Envolver a comunidade na definição e desenvolvimento das atividades e projetos' },
    { titulo: 'Desenvolvimento de Competências', descricao: 'Oferecer oportunidades de aprendizagem e crescimento pessoal em diversas áreas' },
    { titulo: 'Prevenção do Isolamento', descricao: 'Combater a solidão e promover o convívio e a rede de suporte social' },
    { titulo: 'Sustentabilidade Comunitária', descricao: 'Fortalecer os recursos locais e promover a autonomia da comunidade' },
  ];

  areasAtuacao = [
    {
      titulo: 'Atividades Intergeracionais',
      descricao: 'Projetos que promovem o encontro e a colaboração entre diferentes gerações, como oficinas de partilha de saberes, histórias de vida e atividades conjuntas.'
    },
    {
      titulo: 'Oficinas de Competências',
      descricao: 'Workshops e formação em diversas áreas: informática básica, culinária saudável, artesanato, gestão doméstica, educação financeira, entre outras.'
    },
    {
      titulo: 'Grupos de Convívio',
      descricao: 'Espaços regulares de encontro para partilha, conversa e atividades lúdicas, dirigidos a diferentes públicos (seniores, jovens, famílias).'
    },
    {
      titulo: 'Apoio ao Desenvolvimento Comunitário',
      descricao: 'Apoio à organização de iniciativas comunitárias, festas de bairro, projetos de melhoria do espaço público e outras ações coletivas.'
    },
    {
      titulo: 'Informação e Orientação',
      descricao: 'Ponto de informação sobre recursos e serviços disponíveis na comunidade, apoio no acesso a direitos e benefícios sociais.'
    },
  ];

  processoParticipacao = [
    'Visita às instalações para conhecer o espaço e as atividades',
    'Entrevista com técnico para identificar interesses e necessidades',
    'Escolha das atividades de interesse',
    'Preenchimento de ficha de inscrição (com dados pessoais básicos)',
    'Participação nas atividades selecionadas',
  ];

  parcerias = [
    'Junta de Freguesia de Alhos Vedros',
    'Agrupamento de Escolas de Alhos Vedros',
    'Centro de Saúde de Alhos Vedros',
    'Associações locais e coletividades',
    'Empresas locais que apoiam iniciativas comunitárias',
    'Outras IPSS da região',
  ];

  faq = [
    {
      pergunta: 'O Centro Comunitário P.A.R.A.G.E.M é só para idosos?',
      resposta: 'Não, o P.A.R.A.G.E.M é para todas as idades! Temos atividades específicas para crianças, jovens, adultos e seniores, bem como muitas atividades intergeracionais que juntam pessoas de diferentes idades.'
    },
    {
      pergunta: 'É necessário pagar para participar nas atividades?',
      resposta: 'A maioria das atividades são gratuitas. Algumas oficinas específicas que envolvem materiais podem ter um custo simbólico para cobrir despesas, mas sempre com valores acessíveis.'
    },
    {
      pergunta: 'Posso propor uma nova atividade ou oficina?',
      resposta: 'Sim! A participação da comunidade é essencial. Pode partilhar as suas ideias com a equipa técnica, que analisará a viabilidade e poderá ajudar a implementar novas iniciativas.'
    },
    {
      pergunta: 'Como posso saber que atividades estão a decorrer?',
      resposta: 'Através do nosso contacto telefónico, visitando as instalações, ou consultando os cartazes e folhetos informativos que distribuímos na comunidade e disponibilizamos no centro.'
    },
    {
      pergunta: 'Posso ser voluntário no P.A.R.A.G.E.M?',
      resposta: 'Sim, aceitamos voluntários em diversas áreas. Entre em contacto com a nossa equipa para conhecer as oportunidades de voluntariado disponíveis.'
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.buildings = [
      {
        key: 'edificio1',
        tab: 'Centro Comunitário P.A.R.A.G.E.M',
        name: 'Centro Comunitário P.A.R.A.G.E.M',
        desc: 'Espaço comunitário dedicado ao desenvolvimento pessoal e social, promovendo a partilha de aprendizagens e saberes em comunidade através de diversas atividades e oficinas.',
        table: [
          { label: 'Designação', value: 'Centro Comunitário P.A.R.A.G.E.M' },
          { label: 'Morada', value: 'Rua Fernando Pessoa, n.º 1 e 4 C/V, Bloco Q, 2860-071 Alhos Vedros' },
          { label: 'Telefone (Rede Fixa)', value: '212 897 041' },
          { label: 'Email', value: 'paragem@cspslav.pt', isHtml: true },
        ],
        mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt'
        ),
        note: 'Este centro comunitário está localizado no mesmo edifício que o Centro Social Nossa Senhora da Paz, permitindo uma sinergia entre diferentes serviços e respostas sociais.',
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
