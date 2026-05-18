import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicos as ServicosService, ServicoItem } from '../../services/servicos';

@Component({
  selector: 'app-servicos',
  imports: [RouterLink],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos implements OnInit {
  private readonly servicosService = inject(ServicosService);
  private readonly cdr = inject(ChangeDetectorRef);

  servicos: ServicoItem[] = [];

  ngOnInit(): void {
    this.servicosService.listar().subscribe(s => {
      this.servicos = s;
      this.cdr.markForCheck();
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
