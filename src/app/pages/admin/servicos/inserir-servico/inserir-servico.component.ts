import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Servicos } from '../../../../services/servicos';

@Component({
  selector: 'app-inserir-servico',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-servico.component.html',
  styleUrl: './inserir-servico.component.css',
})
export class InserirServicoComponent {
  private readonly servicosService = inject(Servicos);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    title:        ['', [Validators.required]],
    description:  ['', [Validators.required]],
    icon_or_image: ['', [Validators.required]],
  });

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.servicosService.inserir({
      title:         this.form.controls.title.value ?? '',
      description:   this.form.controls.description.value ?? '',
      icon_or_image: this.form.controls.icon_or_image.value ?? '',
    }).subscribe({
      next: () => {
        this.successMessage = 'Serviço inserido com sucesso.';
        this.isSubmitting = false;
        this.form.reset();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao inserir o serviço.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }
}
