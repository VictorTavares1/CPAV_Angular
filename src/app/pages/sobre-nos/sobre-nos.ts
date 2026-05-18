import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { PageContentsService, PageContentItem } from '../../services/page-contents.service';

interface MembroEquipa {
  nome: string;
  cargo: string;
  bio: string;
  contacto: string;
  foto: string;
}

interface ImagemGaleria {
  src: string;
  title: string;
}

@Component({
  selector: 'app-sobre-nos',
  imports: [],
  templateUrl: './sobre-nos.html',
  styleUrl: './sobre-nos.css',
})
export class SobreNos implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  lightbox: ImagemGaleria | null = null;

  quemSomos = '';
  missao = '';
  visao = '';
  valores = '';

  ngOnInit(): void {
    this.pageContentsService.listar('sobre-nos').subscribe(items => {
      const map: Record<string, string> = {};
      items.forEach((i: PageContentItem) => map[i.section_key] = i.content_value);
      this.quemSomos = map['quem_somos'] ?? '';
      this.missao    = map['missao'] ?? '';
      this.visao     = map['visao'] ?? '';
      this.valores   = map['valores'] ?? '';
      this.cdr.markForCheck();
    });
  }

  readonly equipa: MembroEquipa[] = [
    {
      nome: 'Dr. António Rodrigues',
      cargo: 'Diretor Geral',
      bio: 'Com mais de 20 anos de experiência em gestão de instituições sociais, lidera a estratégia global do Centro Social desde 2010.',
      contacto: '<strong>Contacto:</strong> 212 043 425<br><strong>Email:</strong> direcao@cspslav.pt',
      foto: '/images/equipa/diretor.jpg',
    },
    {
      nome: 'Dra. Maria Santos',
      cargo: 'Coordenadora Pedagógica',
      bio: 'Educadora de Infância com formação avançada em intervenção precoce. Responsável pelos serviços educativos desde 2015.',
      contacto: '<strong>Contacto:</strong> 212 892 676<br><strong>Email:</strong> educativos@cspslav.pt',
      foto: '/images/equipa/pedagogica.jpg',
    },
    {
      nome: 'Dra. Isabel Costa',
      cargo: 'Coordenadora Serviços Sociais',
      bio: 'Assistente Social com especialização em gerontologia e apoio familiar. Coordena os serviços sociais há 12 anos.',
      contacto: '<strong>Contacto:</strong> 212 093 035<br><strong>Email:</strong> sociais@cspslav.pt',
      foto: '/images/equipa/sociais.jpg',
    },
    {
      nome: 'Dra. Ana Pereira',
      cargo: 'Coordenadora Apoio Domiciliário',
      bio: 'Técnica de Geriatria com vasta experiência em cuidados domiciliários. Responsável pelo serviço desde 2018.',
      contacto: '<strong>Contacto:</strong> 212 892 676 (ext. 2)<br><strong>Móvel:</strong> 961 420 037',
      foto: '/images/equipa/domicilio.jpg',
    },
    {
      nome: 'Sr. João Silva',
      cargo: 'Coordenador Centro Comunitário',
      bio: 'Animador Sociocultural com formação em intervenção comunitária. Dinamiza o P.A.R.A.G.E.M desde a sua criação.',
      contacto: '<strong>Contacto:</strong> 212 897 041<br><strong>Email:</strong> paragem@cspslav.pt',
      foto: '/images/equipa/comunitario.jpg',
    },
    {
      nome: 'Prof. Carlos Mendes',
      cargo: 'Coordenador Apoio ao Estudo',
      bio: 'Professor do 1º ciclo com especialização em dificuldades de aprendizagem. Responsável pela Sala Arco-Íris desde 2019.',
      contacto: '<strong>Contacto:</strong> 211 628 848<br><strong>Email:</strong> arcoiris@cspslav.pt',
      foto: '/images/equipa/estudo.jpg',
    },
  ];

  readonly galeria: ImagemGaleria[] = [
    { src: '/images/sobre/atividades-educativas.jpg', title: 'Atividades educativas' },
    { src: '/images/sobre/apoio-comunidade.jpg', title: 'Apoio à comunidade' },
    { src: '/images/sobre/trabalho-equipa.jpg', title: 'Trabalho em equipa' },
    { src: '/images/sobre/acompahamento-cuidado.jpg', title: 'Acompanhamento e Cuidado' },
  ];

  openLightbox(img: ImagemGaleria): void {
    this.lightbox = img;
  }

  closeLightbox(): void {
    this.lightbox = null;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
