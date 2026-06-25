import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Servicos } from '../../../../services/servicos';
import { NotifyService } from '../../../../services/notify.service';
import { ApiConfigService } from '../../../../services/api-config.service';

interface PreviewImage {
  file: File;
  url: string;
}

@Component({
  selector: 'app-editar-servico',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-servico.component.html',
  styleUrl: './editar-servico.component.css',
})
export class EditarServicoComponent implements OnInit {
  private readonly servicosService = inject(Servicos);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    title:       ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  servicoId = 0;
  currentImage = '';
  removeCurrentImage = false;
  preview: PreviewImage | null = null;
  fileError = '';
  isLoading = true;
  isSubmitting = false;

  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly maxSize = 0.5 * 1024 * 1024;

  ngOnInit(): void {
    this.servicoId = Number(this.route.snapshot.paramMap.get('id'));

    this.servicosService.lerPorId(this.servicoId).subscribe({
      next: (servico) => {
        this.form.patchValue({
          title:       servico.title,
          description: servico.description,
        });
        this.currentImage = servico.icon_or_image;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => this.router.navigate(['/admin/servicos']),
    });
  }

  imgUrl(icon: string): string {
    if (!icon) return '';
    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/')) return icon;
    return `${this.apiConfig.uploadsUrl}/${icon}`;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

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

    if (this.preview) URL.revokeObjectURL(this.preview.url);
    this.preview = { file, url: URL.createObjectURL(file) };
    this.removeCurrentImage = true;
    input.value = '';
    this.cdr.markForCheck();
  }

  removePreview(): void {
    if (this.preview) URL.revokeObjectURL(this.preview.url);
    this.preview = null;
    this.removeCurrentImage = false;
    this.cdr.markForCheck();
  }

  toggleRemoveCurrent(): void {
    this.removeCurrentImage = !this.removeCurrentImage;
    this.cdr.markForCheck();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.preview && (this.removeCurrentImage || !this.currentImage)) {
      this.fileError = 'É necessário uma imagem.';
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('id', String(this.servicoId));
    formData.append('title', this.form.controls.title.value ?? '');
    formData.append('description', this.form.controls.description.value ?? '');

    if (this.preview) {
      formData.append('imagem', this.preview.file, this.preview.file.name);
    } else {
      formData.append('icon_or_image', this.currentImage);
    }

    this.servicosService.editarComImagem(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        if (this.preview) URL.revokeObjectURL(this.preview.url);
        this.preview = null;
        this.removeCurrentImage = false;
        this.notify.success('Serviço atualizado com sucesso.');
        // Recarrega para refletir imagem atualizada
        this.servicosService.lerPorId(this.servicoId).subscribe(s => {
          this.currentImage = s.icon_or_image;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar o serviço.');
        this.cdr.markForCheck();
      },
    });
  }
}
