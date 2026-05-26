import { Component, ViewChild, ElementRef, afterNextRender, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Noticias } from '../../../../services/noticias';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-inserir-noticia',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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

  selectedFile: File | null = null;
  fileError = '';
  isSubmitting = false;

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
    this.selectedFile = null;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 0.5 * 1024 * 1024; // 500 KB

    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Formato inválido. Só são permitidos JPG, PNG ou WEBP.';
      input.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.fileError = 'A imagem é demasiado grande. O tamanho máximo é 500kb.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
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
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.noticiasService.inserirComImagem(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        if (this.quill) this.quill.setText('');
        this.selectedFile = null;
        this.notify.success('Notícia inserida com sucesso.');
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notify.error(error?.error?.message ?? 'Erro ao inserir a notícia.');
      },
    });
  }
}
