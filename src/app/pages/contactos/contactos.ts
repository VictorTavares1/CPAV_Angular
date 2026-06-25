import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContentsService } from '../../services/page-contents.service';
import { FacilitiesService, FacilityItem } from '../../services/facilities.service';

@Component({
  selector: 'app-contactos',
  imports: [CommonModule],
  templateUrl: './contactos.html',
  styleUrl: './contactos.css',
})
export class Contactos implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  instalacoes: FacilityItem[] = [];

  horariosSecretaria = '';
  horariosSociais = '';
  horariosPreCatl = '';

  ngOnInit(): void {
    this.pageContentsService.listar('contactos').subscribe(items => {
      const map: Record<string, string> = {};
      items.forEach(i => map[i.section_key] = i.content_value);
      this.horariosSecretaria = map['horarios_secretaria'] ?? '';
      this.horariosSociais    = map['horarios_sociais']    ?? '';
      this.horariosPreCatl    = map['horarios_pre_catl']   ?? '';
      this.cdr.markForCheck();
    });

    this.facilitiesService.listar('instalacao').subscribe(i => {
      this.instalacoes = i;
      this.cdr.markForCheck();
    });

  }
}
