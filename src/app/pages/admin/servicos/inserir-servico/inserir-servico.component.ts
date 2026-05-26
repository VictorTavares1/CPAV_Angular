import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Servicos } from '../../../../services/servicos';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-inserir-servico',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-servico.component.html',
  styleUrl: './inserir-servico.component.css',
})
export class InserirServicoComponent {
  private readonly servicosService = inject(Servicos);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title:        ['', [Validators.required]],
    description:  ['', [Validators.required]],
    icon_or_image: ['', [Validators.required]],
  });

  isSubmitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.servicosService.inserir({
      title:         this.form.controls.title.value ?? '',
      description:   this.form.controls.description.value ?? '',
      icon_or_image: this.form.controls.icon_or_image.value ?? '',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        this.notify.success('Serviço inserido com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao inserir o serviço.');
      },
    });
  }
}
