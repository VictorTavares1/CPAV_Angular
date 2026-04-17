import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Interface que representa cada serviço prestado pelo SAD.
 * A chave 'iconeId' é usada no template HTML para selecionar o ícone SVG correspondente.
 */
interface ServicoPrestado {
  /** Identificador do ícone SVG definido no template HTML */
  iconeId: string;
  /** Título do serviço */
  titulo: string;
  /** Descrição resumida do serviço */
  descricao: string;
}

/**
 * Interface que representa cada objetivo do SAD.
 */
interface ObjetivoSad {
  texto: string;
}

/**
 * Componente da página de Serviço de Apoio Domiciliário (SAD).
 *
 * Apresenta:
 *  - Secção de introdução e missão
 *  - Objetivos e público-alvo
 *  - Serviços prestados
 *  - Localização e contactos com mapa Google Maps
 *
 * Migrado de: sad.php
 */
@Component({
  selector: 'app-sad',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sad.component.html',
  styleUrls: ['./sad.component.css']
})
export class SadComponent {

  /**
   * URL segura do mapa Google Maps para o Centro Social Nossa Senhora da Paz,
   * sede do Serviço de Apoio Domiciliário.
   * O DomSanitizer é necessário para que o Angular aceite o URL externo no iframe.
   */
  mapUrl: SafeResourceUrl;

  /**
   * Lista de objetivos do Serviço de Apoio Domiciliário.
   */
  objetivos: ObjetivoSad[] = [
    { texto: 'Contribuir para a melhoria da qualidade de vida das pessoas e famílias.' },
    { texto: 'Prevenir situações de dependência e promover a autonomia.' },
    { texto: 'Retardar ou evitar a institucionalização (internamento em lares).' },
    { texto: 'Prestar apoio aos cuidadores informais.' }
  ];

  /**
   * Lista de serviços prestados pelo SAD.
   * Os ícones SVG correspondentes a cada 'iconeId' estão definidos no template HTML,
   * evitando a injeção de HTML via [innerHTML] e os avisos de segurança do Angular.
   */
  servicosPrestados: ServicoPrestado[] = [
    {
      iconeId: 'higiene-pessoal',
      titulo: 'Higiene Pessoal',
      descricao: 'Cuidados de higiene e conforto pessoal no domicílio do utente.'
    },
    {
      iconeId: 'refeicoes',
      titulo: 'Refeições',
      descricao: 'Confeção, transporte e apoio na toma das refeições.'
    },
    {
      iconeId: 'higiene-habitacional',
      titulo: 'Higiene Habitacional',
      descricao: 'Limpeza e manutenção estritamente necessária do espaço habitacional.'
    },
    {
      iconeId: 'tratamento-roupa',
      titulo: 'Tratamento de Roupa',
      descricao: 'Recolha, tratamento e entrega de roupa pessoal e de cama.'
    },
    {
      iconeId: 'acompanhamento',
      titulo: 'Acompanhamento',
      descricao: 'Acompanhamento a consultas e exames de diagnóstico.'
    },
    {
      iconeId: 'apoio-psicossocial',
      titulo: 'Apoio Psicossocial',
      descricao: 'Atividades de animação, sociabilização e apoio psicossocial.'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {
    /* Sanitiza o URL do mapa para evitar erros de segurança do Angular */
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1557.8750392871523!2d-9.007227774552367!3d38.65462653474254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19381b8976b8a5%3A0xdb0ad9fe8017c819!2scentro%20social%20da%20nossa%20sra.%20da%20paz!5e0!3m2!1spt-PT!2spt!4v1769965884824!5m2!1spt-PT!2spt'
    );
  }
}
