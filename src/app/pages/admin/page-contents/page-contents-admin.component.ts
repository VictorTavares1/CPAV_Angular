import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageContentsService, PageContentItem } from '../../../services/page-contents.service';
import { NotifyService } from '../../../services/notify.service';

interface EditState {
  [id: number]: { editing: boolean; value: string; saving: boolean };
}

const RICH_TEXT_KEYS = new Set([
  'hero_description',
  'servicos_description',
  'quem_somos',
  'missao',
  'visao',
  'valores',
]);

@Component({
  selector: 'app-page-contents-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page-contents-admin.component.html',
  styleUrl: './page-contents-admin.component.css',
})
export class PageContentsAdminComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  contents: PageContentItem[] = [];
  editState: EditState = {};
  isLoading = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly quillInstances: Record<number, any> = {};

  get pages(): string[] {
    return [...new Set(this.contents.map(c => c.Page_name))];
  }

  contentsByPage(page: string): PageContentItem[] {
    return this.contents.filter(c => c.Page_name === page);
  }

  isRichText(key: string): boolean {
    return RICH_TEXT_KEYS.has(key);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.pageContentsService.listar().subscribe(rows => {
      // A página "contactos" tem o seu próprio editor em /admin/contactos,
      // por isso esconde-se aqui para evitar editar a mesma coisa em dois sítios.
      this.contents = rows.filter(r => r.Page_name !== 'contactos');
      this.editState = {};
      this.contents.forEach(r => {
        this.editState[r.id] = { editing: false, value: r.content_value, saving: false };
      });
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  async startEdit(item: PageContentItem): Promise<void> {
    this.editState[item.id].editing = true;
    this.cdr.detectChanges();

    if (this.isRichText(item.section_key)) {
      await this.initQuill(item);
    }
  }

  cancelEdit(item: PageContentItem): void {
    this.editState[item.id].editing = false;
    this.editState[item.id].value = item.content_value;
    delete this.quillInstances[item.id];
  }

  save(item: PageContentItem): void {
    const state = this.editState[item.id];
    state.saving = true;

    this.pageContentsService.editar(item.id, state.value).subscribe({
      next: () => {
        item.content_value = state.value;
        state.editing = false;
        state.saving = false;
        delete this.quillInstances[item.id];
        this.cdr.detectChanges();
        this.notify.success('Conteúdo atualizado com sucesso.');
      },
      error: (err) => {
        state.saving = false;
        this.cdr.detectChanges();
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar.');
      },
    });
  }

  private async initQuill(item: PageContentItem): Promise<void> {
    const container = document.getElementById('quill-editor-' + item.id);
    if (!container || this.quillInstances[item.id]) return;

    const { default: Quill } = await import('quill');
    const quill = new Quill(container, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [1, 2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
    });

    // Pré-popula com o valor atual.
    quill.root.innerHTML = this.editState[item.id].value || '';

    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      const isEmpty = html === '' || html === '<p><br></p>';
      this.editState[item.id].value = isEmpty ? '' : html;
    });

    this.quillInstances[item.id] = quill;
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
