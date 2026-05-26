import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contactos as ContactosService, ContactoItem } from '../../services/contactos';
import { PageContentsService } from '../../services/page-contents.service';
import { FacilitiesService, FacilityItem } from '../../services/facilities.service';

@Component({
  selector: 'app-contactos',
  imports: [CommonModule],
  templateUrl: './contactos.html',
  styleUrl: './contactos.css',
})
export class Contactos implements OnInit {
  private readonly contactosService = inject(ContactosService);
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly cdr = inject(ChangeDetectorRef);

  contactos: ContactoItem[] = [];
  instalacoes: FacilityItem[] = [];
  departamentos: FacilityItem[] = [];

  sedeMorada = '';
  sedeTelGeral = '';
  sedeTelMovel = '';
  sedeEmail = '';
  sedeResponsavel = '';

  horariosSecretaria = '';
  horariosSociais = '';
  horariosPreCatl = '';

  ngOnInit(): void {
    this.contactosService.listar('rapido').subscribe(c => {
      this.contactos = c;
      this.cdr.markForCheck();
    });

    this.pageContentsService.listar('contactos').subscribe(items => {
      const map: Record<string, string> = {};
      items.forEach(i => map[i.section_key] = i.content_value);
      this.sedeMorada         = map['sede_morada']         ?? '';
      this.sedeTelGeral       = map['sede_tel_geral']      ?? '';
      this.sedeTelMovel       = map['sede_tel_movel']      ?? '';
      this.sedeEmail          = map['sede_email']          ?? '';
      this.sedeResponsavel    = map['sede_responsavel']    ?? '';
      this.horariosSecretaria = map['horarios_secretaria'] ?? '';
      this.horariosSociais    = map['horarios_sociais']    ?? '';
      this.horariosPreCatl    = map['horarios_pre_catl']   ?? '';
      this.cdr.markForCheck();
    });

    this.facilitiesService.listar('instalacao').subscribe(i => {
      this.instalacoes = i;
      this.cdr.markForCheck();
    });

    this.facilitiesService.listar('departamento').subscribe(d => {
      this.departamentos = d;
      this.cdr.markForCheck();
    });
  }

  hrefFor(c: ContactoItem): string | null {
    const icon = c.icon.toLowerCase();
    if (icon.includes('phone')) return `tel:+351${c.value.replace(/\s/g, '')}`;
    if (icon.includes('envelope') || icon.includes('mail')) return `mailto:${c.value}`;
    return null;
  }

  telHref(tel: string | null): string | null {
    if (!tel) return null;
    const digits = tel.replace(/\D/g, '');
    return digits ? `tel:+351${digits}` : null;
  }

  emailHref(email: string | null): string | null {
    return email ? `mailto:${email}` : null;
  }
}
