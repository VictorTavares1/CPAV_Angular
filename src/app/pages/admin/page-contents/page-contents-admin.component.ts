import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageContentsService, PageContentItem } from '../../../services/page-contents.service';

interface EditState {
  [id: number]: { editing: boolean; value: string; saving: boolean };
}

@Component({
  selector: 'app-page-contents-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page-contents-admin.component.html',
  styleUrl: './page-contents-admin.component.css',
})
export class PageContentsAdminComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  contents: PageContentItem[] = [];
  editState: EditState = {};
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  get pages(): string[] {
    return [...new Set(this.contents.map(c => c.Page_name))];
  }

  contentsByPage(page: string): PageContentItem[] {
    return this.contents.filter(c => c.Page_name === page);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.pageContentsService.listar().subscribe(rows => {
      this.contents = rows;
      this.editState = {};
      rows.forEach(r => {
        this.editState[r.id] = { editing: false, value: r.content_value, saving: false };
      });
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  startEdit(id: number): void {
    this.editState[id].editing = true;
  }

  cancelEdit(id: number, originalValue: string): void {
    this.editState[id].editing = false;
    this.editState[id].value = originalValue;
  }

  save(item: PageContentItem): void {
    const state = this.editState[item.id];
    state.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.pageContentsService.editar(item.id, state.value).subscribe({
      next: () => {
        item.content_value = state.value;
        state.editing = false;
        state.saving = false;
        this.successMessage = 'Conteúdo atualizado com sucesso.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        state.saving = false;
        this.errorMessage = err?.error?.message ?? 'Erro ao atualizar.';
        this.cdr.detectChanges();
      },
    });
  }

  labelFor(key: string): string {
    const labels: Record<string, string> = {
      hero_title: 'Título Hero',
      hero_description: 'Descrição Hero',
      servicos_description: 'Descrição Serviços',
      quem_somos: 'Quem Somos',
      missao: 'Missão',
      visao: 'Visão',
      valores: 'Valores',
    };
    return labels[key] ?? key;
  }

  pageLabel(page: string): string {
    const labels: Record<string, string> = {
      home: 'Página Inicial',
      'sobre-nos': 'Sobre Nós',
    };
    return labels[page] ?? page;
  }
}
