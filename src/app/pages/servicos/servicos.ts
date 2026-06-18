import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Servicos as ServicosService, ServicoItem } from '../../services/servicos';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-servicos',
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos implements OnInit {
  private readonly servicosService = inject(ServicosService);
  private readonly cdr = inject(ChangeDetectorRef);

  servicos: ServicoItem[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.servicosService.listar().subscribe({
      next: (s) => {
        this.servicos = s;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** Mapeia o título do serviço para a rota da respetiva página de detalhe. */
  routeFor(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('pré-escolar') || t.includes('pre-escolar')) return '/servicos/pre-escolar';
    if (t.includes('catl') || t.includes('tempos livres')) return '/servicos/catl';
    if (t.includes('domiciliário') || t.includes('domiciliario') || t.includes('sad')) return '/servicos/sad';
    if (t.includes('paragem')) return '/servicos/paragem';
    if (t.includes('estudo')) return '/servicos/apoio-estudo';
    if (t.includes('belém') || t.includes('belem')) return '/servicos/nossa-senhora-belem';
    return '/servicos';
  }
}
