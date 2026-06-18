import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, afterNextRender, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Noticias } from '../../../../services/noticias';
import { NotifyService } from '../../../../services/notify.service';

interface PreviewImage {
  file: File;
  url: string;
}

@Component({
  selector: 'app-inserir-noticia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-noticia.component.html',
  styleUrl: './inserir-noticia.component.css',
})
export class InserirNoticiaComponent {
  @ViewChild('quillEditor') quillEditorRef!: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private quill!: any;

  private readonly fb = inject(FormBuilder);
  private readonly noticiasService = inject(Noticias);
  private readonly notify = inject(NotifyService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  previews: PreviewImage[] = [];
  fileError = '';
  isSubmitting = false;

  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly maxSize = 0.5 * 1024 * 1024; // 500 KB

  constructor() {
    afterNextRender(() => {
      this.initQuill();
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
    formData.append('title', this.form.controls.title.value ?? '');
    formData.append('content', this.form.controls.content.value ?? '');
    for (const p of this.previews) {
      formData.append('images[]', p.file, p.file.name);
    }

    this.noticiasService.inserirComImagem(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        if (this.quill) this.quill.setText('');
        this.previews.forEach(p => URL.revokeObjectURL(p.url));
        this.previews = [];
        this.notify.success('Notícia inserida com sucesso.');
        setTimeout(() => this.router.navigate(['/admin/noticias']), 600);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notify.error(error?.error?.message ?? 'Erro ao inserir a notícia.');
      },
    });
  }
}
