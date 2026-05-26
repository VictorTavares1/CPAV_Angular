import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticiaItem, Noticias } from '../../../services/noticias';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-noticias-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './noticias-admin.component.html',
  styleUrl: './noticias-admin.component.css',
})
export class NoticiasAdminComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorRef!: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private quill!: any;

  private readonly noticiasService = inject(Noticias);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  noticias: NoticiaItem[] = [];
  isLoading = false;
  editingId: number | null = null;

  constructor() {
    afterNextRender(() => {
      this.initQuill();
      this.loadNoticias();
    });
  }

  private async initQuill(): Promise<void> {
    const { default: Quill } = await import('quill');
    this.quill = new Quill(this.quillEditorRef.nativeElement, {
      theme: 'snow',
      modules: { toolbar: true },
    });

    this.quill.on('text-change', () => {
      const html = this.quill.root.innerHTML;
      const isEmpty = html === '' || html === '<p><br></p>';
      this.form.controls.content.setValue(isEmpty ? '' : html, { emitEvent: false });
    });
  }

  ngOnInit(): void {
    // Carregamento feito em afterNextRender para garantir execução no browser
  }

  loadNoticias(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.noticiasService.listarAdmin().subscribe({
      next: (rows) => {
        this.noticias = rows;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.notify.error(error?.error?.message ?? 'Erro ao carregar notícias.');
      },
    });
  }

  edit(noticia: NoticiaItem): void {
    this.editingId = noticia.id;
    this.form.controls.title.setValue(noticia.title);
    this.form.controls.content.setValue(noticia.content);
    if (this.quill) {
      this.quill.root.innerHTML = noticia.content;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submit(): void {
    if (!this.editingId || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const title = this.form.controls.title.value ?? '';
    const content = this.form.controls.content.value ?? '';

    this.noticiasService.editar({ id: this.editingId, title, content }).subscribe({
      next: () => {
        this.notify.success('Notícia atualizada com sucesso.');
        this.resetAndReload();
      },
      error: (error) => {
        this.notify.error(error?.error?.message ?? 'Erro ao atualizar notícia.');
      },
    });
  }

  async toggle(noticia: NoticiaItem): Promise<void> {
    const idStateAtual = (noticia as unknown as { idState?: number }).idState ?? 1;
    const acao = idStateAtual === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} a notícia "${noticia.title}"?`);
    if (!ok) return;

    this.noticiasService.toggle(noticia.id).subscribe({
      next: () => {
        this.notify.success('Estado da notícia alterado.');
        this.loadNoticias();
      },
      error: (error) => {
        this.notify.error(error?.error?.message ?? 'Erro ao alterar estado da notícia.');
      },
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset();
    if (this.quill) this.quill.setText('');
  }

  private resetAndReload(): void {
    this.cancelEdit();
    this.loadNoticias();
  }
}
