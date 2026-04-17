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
  selector: 'app-apoio-estudo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apoio-estudo.component.html',
  styleUrls: ['./apoio-estudo.component.css']
})
export class ApoioEstudoComponent {

  activeTab = 'edificio1';
  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  buildings: Building[];

  metodologia = [
    { titulo: 'Plano Individualizado', descricao: 'Avaliação inicial para identificar necessidades específicas de cada aluno' },
    { titulo: 'Acompanhamento Personalizado', descricao: 'Grupos reduzidos (máximo 8 alunos por técnico)' },
    { titulo: 'Metodologias Ativas', descricao: 'Utilização de estratégias diversificadas e motivadoras' },
    { titulo: 'Desenvolvimento de Competências', descricao: 'Foco em organização, planeamento e métodos de estudo' },
    { titulo: 'Articulação com a Escola', descricao: 'Contacto regular com professores e diretores de turma' },
    { titulo: 'Apoio Psicopedagógico', descricao: 'Acompanhamento de dificuldades de aprendizagem específicas' },
    { titulo: 'Ambiente Estimulante', descricao: 'Espaço equipado com recursos didáticos adequados' },
  ];

  docInscricao = [
    'Cartão de Cidadão do aluno',
    'Cartão de Cidadão do encarregado de educação',
    'Comprovativo de residência',
    'Número de identificação fiscal (NIF)',
    'Comprovativo de matrícula escolar',
    'Horário escolar',
    'Ficha médica atualizada',
    '1 fotografia tipo passe',
  ];

  criteriosPrioridade = [
    'Crianças com dificuldades de aprendizagem diagnosticadas',
    'Alunos em risco de retenção',
    'Famílias com baixos recursos económicos',
    'Alunos referenciados pela escola',
  ];

  faq = [
    {
      pergunta: 'O apoio ao estudo inclui explicações individuais?',
      resposta: 'Sim, para além do apoio em grupo, são disponibilizadas sessões individuais de reforço em disciplinas específicas conforme as necessidades de cada aluno.'
    },
    {
      pergunta: 'Como é feita a articulação com a escola?',
      resposta: 'Mantemos contacto regular com professores e diretores de turma, participamos em reuniões escolares e solicitamos informações sobre o progresso dos alunos.'
    },
    {
      pergunta: 'O serviço funciona durante as férias escolares?',
      resposta: 'Durante as férias oferecemos programas de férias com atividades lúdico-pedagógicas e workshops temáticos. O apoio ao estudo regular apenas funciona durante o período letivo.'
    },
    {
      pergunta: 'Existem apoios financeiros para famílias carenciadas?',
      resposta: 'Sim, através do Programa Operacional de Apoio às Pessoas Mais Carenciadas (PO APMC) e de protocolos com a Segurança Social, podemos apoiar famílias com dificuldades económicas.'
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.buildings = [
      {
        key: 'edificio1',
        tab: 'Sala Arco-Íris',
        name: 'Sala Arco-Íris - Apoio ao Estudo',
        desc: 'Espaço dedicado ao acompanhamento escolar de crianças e jovens, promovendo hábitos de estudo, reforço das aprendizagens e desenvolvimento de competências essenciais para o sucesso educativo.',
        table: [
          { label: 'Designação', value: 'Sala Arco-Íris - Apoio ao Estudo' },
          { label: 'Morada', value: 'Praça Almada Negreiros, Loja 6, Urbanização Bela Rosa, 2860-115 Alhos Vedros' },
          { label: 'Telefone (Rede Fixa)', value: '211 628 848' },
          { label: 'Email', value: 'arcoiris@cspslav.pt', isHtml: true },
        ],
        mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d550.8381877360331!2d-9.0225692889697!3d38.64861950997912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1937fa9158d949%3A0x14e65847d550d2bd!2sCentro%20Social%20e%20Paroquial%20de%20S.%20Louren%C3%A7o%20de%20Alhos%20Vedros!5e0!3m2!1spt-PT!2spt!4v1769907260549!5m2!1spt-PT!2spt'
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
