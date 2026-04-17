import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-po-apmc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './po-apmc.component.html',
  styleUrls: ['./po-apmc.component.css']
})
export class PoApmcComponent {

  lightboxVisible = false;
  lightboxImg = '';
  lightboxTitle = '';

  objetivos = [
    'Diminuir situações de vulnerabilidade',
    'Promover a inclusão social',
    'Reforçar as respostas das políticas públicas',
  ];

  tiposApoio = [
    { titulo: 'Apoio Alimentar', descricao: 'Cabazes com produtos essenciais' },
    { titulo: 'Bens de Consumo Básico', descricao: 'Produtos de higiene e limpeza' },
    { titulo: 'Acompanhamento Social', descricao: 'Orientações e capacitação' },
  ];

  passosSolicitacao = [
    { titulo: 'Contacte a nossa instituição', descricao: 'através dos contactos disponíveis no site' },
    { titulo: 'Agende uma entrevista social', descricao: 'para avaliação da situação' },
    { titulo: 'Apresente a documentação necessária', descricao: '(identificação, comprovativos de rendimento, etc.)' },
    { titulo: 'Participe no processo de avaliação', descricao: 'conduzido pela equipa técnica' },
    { titulo: 'Receba orientação', descricao: 'sobre o tipo de apoio disponível e condições de acesso' },
  ];

  faq = [
    {
      pergunta: 'Quem pode beneficiar do PO APMC?',
      resposta: 'Pessoas e famílias em situação de carência económica comprovada, mediante avaliação social que considera diversos fatores como rendimentos, composição do agregado, despesas fixas e situação específica.'
    },
    {
      pergunta: 'Com que frequência é distribuído o apoio alimentar?',
      resposta: 'A distribuição regular ocorre semanalmente, às quartas-feiras. A periodicidade específica para cada beneficiário é definida com base na avaliação da situação.'
    },
    {
      pergunta: 'O apoio inclui apenas alimentos?',
      resposta: 'Não. Além do apoio alimentar, o programa pode incluir bens de consumo básico (produtos de higiene e limpeza) e medidas de acompanhamento social para capacitação e inclusão.'
    },
    {
      pergunta: 'É necessário pagar algo pelo apoio recebido?',
      resposta: 'Não, o apoio do PO APMC é totalmente gratuito para os beneficiários. O programa é financiado por fundos europeus e nacionais, gerido através de parcerias com instituições sociais.'
    },
  ];

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
