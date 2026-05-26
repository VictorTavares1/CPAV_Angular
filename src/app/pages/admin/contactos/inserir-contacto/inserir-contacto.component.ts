import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contactos, ContactoCategory } from '../../../../services/contactos';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-inserir-contacto',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-contacto.component.html',
  styleUrl: './inserir-contacto.component.css',
})
export class InserirContactoComponent {
  private readonly contactosService = inject(Contactos);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    type:     ['', [Validators.required]],
    value:    ['', [Validators.required]],
    icon:     ['', [Validators.required]],
    category: ['footer', [Validators.required]],
  });

  isSubmitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.contactosService.inserir({
      type:     this.form.controls.type.value ?? '',
      value:    this.form.controls.value.value ?? '',
      icon:     this.form.controls.icon.value ?? '',
      category: (this.form.controls.category.value ?? 'footer') as ContactoCategory,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset({ category: 'footer' });
        this.notify.success('Contacto inserido com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao inserir o contacto.');
      },
    });
  }
}
