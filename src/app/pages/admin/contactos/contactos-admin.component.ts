import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Contactos, ContactoItemAdmin } from '../../../services/contactos';
import { PageContentsService, PageContentItem } from '../../../services/page-contents.service';
import { FacilitiesService, FacilityItemAdmin } from '../../../services/facilities.service';
import { NotifyService } from '../../../services/notify.service';

interface PageEditState {
  editing: boolean;
  value: string;
  saving: boolean;
}

interface PageField {
  key: string;
  label: string;
  item: PageContentItem;
}

@Component({
  selector: 'app-contactos-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contactos-admin.component.html',
  styleUrl: './contactos-admin.component.css',
})
export class ContactosAdminComponent implements OnInit {
  private readonly contactosService = inject(Contactos);
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  contactos: ContactoItemAdmin[] = [];
  facilities: FacilityItemAdmin[] = [];

  sedeFields: PageField[] = [];
  horariosFields: PageField[] = [];
  pageEdit: Record<number, PageEditState> = {};

  loadingContactos = true;
  loadingPages = true;
  loadingFacilities = true;

  searchQuery = '';
  selectedStatus = '';

  private readonly sedeKeys = ['sede_morada', 'sede_tel_geral', 'sede_tel_movel', 'sede_email', 'sede_responsavel'];
  private readonly horariosKeys = ['horarios_secretaria', 'horarios_sociais', 'horarios_pre_catl'];

  private readonly labels: Record<string, string> = {
    sede_morada:         'Morada',
    sede_tel_geral:      'Telefone Geral',
    sede_tel_movel:      'Telefone Móvel',
    sede_email:          'Email',
    sede_responsavel:    'Responsável',
    horarios_secretaria: 'Secretaria (Sede)',
    horarios_sociais:    'Serviços Sociais',
    horarios_pre_catl:   'Pré-Escolar e CATL',
  };

  get isLoading(): boolean {
    return this.loadingContactos || this.loadingPages || this.loadingFacilities;
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loadingContactos = true;
    this.loadingPages = true;
    this.loadingFacilities = true;

    this.contactosService.listarAdmin().subscribe(rows => {
      this.contactos = rows;
      this.loadingContactos = false;
      this.cdr.markForCheck();
    });

    this.pageContentsService.listar('contactos').subscribe(rows => {
      this.pageEdit = {};
      rows.forEach(r => {
        this.pageEdit[r.id] = { editing: false, value: r.content_value, saving: false };
      });
      this.sedeFields = this.buildFields(rows, this.sedeKeys);
      this.horariosFields = this.buildFields(rows, this.horariosKeys);
      this.loadingPages = false;
      this.cdr.markForCheck();
    });

    this.facilitiesService.listarAdmin().subscribe(rows => {
      this.facilities = rows;
      this.loadingFacilities = false;
      this.cdr.markForCheck();
    });
  }

  private buildFields(rows: PageContentItem[], keys: string[]): PageField[] {
    const result: PageField[] = [];
    for (const key of keys) {
      const item = rows.find(r => r.section_key === key);
      if (item) {
        result.push({ key, label: this.labels[key] ?? key, item });
      }
    }
    return result;
  }

  // ---- Contactos ----
  get filtered(): ContactoItemAdmin[] {
    return this.contactos.filter(c => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || c.type.toLowerCase().includes(q) || c.value.toLowerCase().includes(q);
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && c.idState === 1) ||
        (this.selectedStatus === '2' && c.idState !== 1);
      return matchSearch && matchStatus;
    });
  }

  async toggle(c: ContactoItemAdmin): Promise<void> {
    const acao = c.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} o contacto "${c.type}"?`);
    if (!ok) return;

    this.contactosService.toggle(c.id).subscribe({
      next: () => {
        this.notify.success('Estado do contacto alterado.');
        this.loadAll();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.');
      },
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
  }

  // ---- Page contents (Sede + Horários) ----
  startEditPage(item: PageContentItem): void {
    this.pageEdit[item.id].editing = true;
  }

  cancelEditPage(item: PageContentItem): void {
    this.pageEdit[item.id].editing = false;
    this.pageEdit[item.id].value = item.content_value;
  }

  savePage(item: PageContentItem): void {
    const state = this.pageEdit[item.id];
    state.saving = true;
    this.pageContentsService.editar(item.id, state.value).subscribe({
      next: () => {
        item.content_value = state.value;
        state.editing = false;
        state.saving = false;
        this.notify.success('Conteúdo atualizado.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        state.saving = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar.');
        this.cdr.markForCheck();
      },
    });
  }

  // ---- Facilities (Instalações + Departamentos) ----
  get instalacoes(): FacilityItemAdmin[] {
    return this.facilities.filter(f => f.category === 'instalacao');
  }

  get departamentos(): FacilityItemAdmin[] {
    return this.facilities.filter(f => f.category === 'departamento');
  }

  async toggleFacility(f: FacilityItemAdmin): Promise<void> {
    const acao = f.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} "${f.name}"?`);
    if (!ok) return;

    this.facilitiesService.toggle(f.id).subscribe({
      next: () => {
        this.notify.success('Estado alterado.');
        this.loadAll();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.');
      },
    });
  }
}
