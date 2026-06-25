import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, afterNextRender, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Noticias, NoticiaImage } from '../../../../services/noticias';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NotifyService } from '../../../../services/notify.service';

interface PreviewImage {
  file: File;
  url: string;
}

interface ExistingImage extends NoticiaImage {
  toRemove: boolean;
}

@Component({
  selector: 'app-editar-noticia',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-noticia.component.html',
  styleUrl: './editar-noticia.component.css',
})
export class EditarNoticiaComponent {
  @ViewChild('quillEditor') quillEditorRef!: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private quill!: any;

  private readonly fb = inject(FormBuilder);
  private readonly noticiasService = inject(Noticias);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly notify = inject(NotifyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    title:   ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  noticiaId = 0;
  existing: ExistingImage[] = [];
  previews: PreviewImage[] = [];
  fileError = '';
  isLoading = true;
  isSubmitting = false;

  private readonly uploadsUrl = this.apiConfig.uploadsUrl;
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly maxSize = 0.5 * 1024 * 1024;

  constructor() {
    afterNextRender(() => {
      this.initQuill();
      this.loadNoticia();
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

  private loadNoticia(): void {
    this.noticiaId = Number(this.route.snapshot.paramMap.get('id'));

    this.noticiasService.getByIdAdmin(this.noticiaId).subscribe({
      next: (n) => {
        this.form.patchValue({ title: n.title, content: n.content });
        if (this.quill) this.quill.root.innerHTML = n.content;
        this.existing = (n.images ?? []).map(img => ({ ...img, toRemove: false }));
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Notícia não encontrada.');
        this.router.navigate(['/admin/noticias']);
      },
    });
  }

  imgUrl(filename: string): string {
    return `${this.uploadsUrl}/${filename.split('/').map(p => encodeURIComponent(p)).join('/')}`;
  }

  toggleRemoveExisting(index: number): void {
    this.existing[index].toRemove = !this.existing[index].toRemove;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';

    if (!input.files || input.files.length === 0) return;

    const novos: PreviewImage[] = [];
    for (const file of Array.from(input.files)) {
      if (!this.allowedTypes.includes(file.type)) {
        this.fileError = `'${file.name}': formato inválido. Só JPG, PNG ou WEBP.`;
        input.value = '';
        return;
      }
      if (file.size > this.maxSize) {
        this.fileError = `'${file.name}': demasiado grande. Máx. 500kb.`;
        input.value = '';
        return;
      }
      novos.push({ file, url: URL.createObjectURL(file) });
    }

    this.previews = [...this.previews, ...novos];
    input.value = '';
  }

  removePreview(index: number): void {
    const removed = this.previews[index];
    if (removed) URL.revokeObjectURL(removed.url);
    this.previews = this.previews.filter((_, i) => i !== index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('id', String(this.noticiaId));
    formData.append('title', this.form.controls.title.value ?? '');
    formData.append('content', this.form.controls.content.value ?? '');

    const remover = this.existing.filter(e => e.toRemove).map(e => e.id);
    if (remover.length > 0) {
      formData.append('imagensRemover', remover.join(','));
    }

    for (const p of this.previews) {
      formData.append('images[]', p.file, p.file.name);
    }

    this.noticiasService.editarComImagens(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.previews.forEach(p => URL.revokeObjectURL(p.url));
        this.previews = [];
        this.notify.success('Notícia atualizada com sucesso.');
        // Recarrega para refletir o estado real (imagens removidas, novas com sufixos, etc.)
        this.loadNoticia();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar a notícia.');
      },
    });
  }
}
