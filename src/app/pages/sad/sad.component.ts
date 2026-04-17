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
  note?: string;
}

@Component({
  selector: 'app-sad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sad.component.html',
  styleUrls: ['./sad.component.css']
})
export class SadComponent {

  activeTab = 'edificio1';
  buildings: Building[];

  servicosPrestados = [
    { titulo: 'Apoio Doméstico', descricao: 'Limpeza da casa, arrumações, lavagem e passagem de roupa' },
    { titulo: 'Apoio na Alimentação', descricao: 'Preparação de refeições, apoio na alimentação quando necessário' },
    { titulo: 'Cuidados Pessoais', descricao: 'Apoio na higiene pessoal, vestir/despir, cuidados de beleza' },
    { titulo: 'Acompanhamento', descricao: 'Acompanhamento em consultas médicas, passeios, atividades sociais' },
    { titulo: 'Apoio Administrativo', descricao: 'Ajuda na gestão de documentação, pagamentos, correspondência' },
    { titulo: 'Vigilância e Companhia', descricao: 'Presença regular, prevenção de situações de risco e isolamento' },
    { titulo: 'Estimulação Cognitiva', descricao: 'Atividades de memória, leitura, conversação, jogos' },
    { titulo: 'Primeiros Socorros', descricao: 'Cuidados básicos de saúde e alerta para situações de emergência' },
  ];

  metodologia = [
    { titulo: 'Avaliação Inicial', descricao: 'Visita domiciliária para avaliação das necessidades e definição do plano de intervenção' },
    { titulo: 'Plano Individualizado', descricao: 'Elaboração de um plano de cuidados específico para cada utente' },
    { titulo: 'Intervenção Regular', descricao: 'Visitas periódicas conforme estabelecido no plano individual' },
    { titulo: 'Monitorização Contínua', descricao: 'Reavaliação regular das necessidades e ajuste do plano de intervenção' },
    { titulo: 'Trabalho em Rede', descricao: 'Articulação com centros de saúde, serviços sociais, família e comunidade' },
    { titulo: 'Formação Contínua', descricao: 'Equipa com formação específica em geriatria e apoio domiciliário' },
  ];

  docNecessaria = [
    'Cartão de Cidadão do utente e do representante legal (se aplicável)',
    'Comprovativo de residência',
    'Comprovativo de recursos económicos (pensão, reforma, outros rendimentos)',
    'Relatório médico atualizado com diagnóstico e medicação',
    'Declaração médica que ateste a necessidade de apoio domiciliário',
    'Número de utente do Serviço Nacional de Saúde',
    'Comprovativo de escalão de ação social (se aplicável)',
  ];

  etapasProcesso = [
    { titulo: 'Contacto Inicial', descricao: 'Telefone ou visita ao equipamento de coordenação' },
    { titulo: 'Avaliação Social', descricao: 'Entrevista para identificação de necessidades' },
    { titulo: 'Visita Domiciliária', descricao: 'Avaliação do ambiente e condições do domicílio' },
    { titulo: 'Análise Técnica', descricao: 'Estudo do caso pela equipa técnica' },
    { titulo: 'Elaboração do Plano', descricao: 'Definição do plano individual de intervenção' },
    { titulo: 'Aprovação e Início', descricao: 'Formalização do contrato e início do serviço' },
  ];

  faq = [
    {
      pergunta: 'Quem pode beneficiar do S.A.D.?',
      resposta: 'Pessoas com 65 ou mais anos, ou pessoas com deficiência ou dependência comprovada, que residam na área de intervenção e necessitem de apoio para manter-se no seu domicílio.'
    },
    {
      pergunta: 'O serviço tem custos para o utente?',
      resposta: 'Sim, o serviço tem uma comparticipação financeira definida com base nos rendimentos do utente e no tipo de serviços prestados. São aplicados os escalões de ação social definidos pela Segurança Social.'
    },
    {
      pergunta: 'Com que frequência são feitas as visitas?',
      resposta: 'A frequência das visitas é definida no plano individual de cada utente, podendo variar desde visitas diárias a visitas semanais, conforme as necessidades identificadas.'
    },
    {
      pergunta: 'O S.A.D. funciona aos fins-de-semana e feriados?',
      resposta: 'O serviço regular funciona de segunda a sexta-feira. Aos sábados disponibilizamos serviço de urgência para situações específicas. Feriados têm regime especial.'
    },
    {
      pergunta: 'Como é feita a articulação com a família?',
      resposta: 'Mantemos contacto regular com a família através de reuniões periódicas, contacto telefónico e relatórios de acompanhamento. A família é considerada parte integrante do processo de cuidado.'
    },
  ];

  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  constructor(private sanitizer: DomSanitizer) {
    this.buildings = [
      {
        key: 'edificio1',
        tab: 'Centro Social Nossa Senhora da Paz',
        name: 'Centro Social Nossa Senhora da Paz',
        desc: 'Equipamento que coordena o Serviço de Apoio Domiciliário na área de Alhos Vedros, proporcionando cuidados personalizados a idosos e pessoas com dependência.',
        table: [
          { label: 'Designação', value: 'Centro Social Nossa Senhora da Paz' },
          { label: 'Morada', value: 'Bairro da Quinta da Fonte da Prata, Rua Fernando Pessoa, n.º 10, Bloco Q, 2860-071 Alhos Vedros' },
          { label: 'Telefone (Rede Fixa)', value: '212 892 676' },
          { label: 'Telemóvel', value: '961 420 037' },
          { label: 'Email', value: '<a href="mailto:csnsp@hotmail.com">csnsp@hotmail.com</a>', isHtml: true },
          { label: 'Área de Intervenção', value: 'Alhos Vedros e áreas limítrofes' },
        ],
        mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194.73420031388608!2d-9.007148273816933!3d38.65469259941962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769898670192!5m2!1spt-PT!2spt'
        ),
        images: [],
        note: 'Este equipamento também inclui resposta de Pré-Escolar e C.A.T.L. (Centro de Atividades de Tempos Livres).',
      },
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
