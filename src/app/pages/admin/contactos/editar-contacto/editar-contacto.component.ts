import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contactos, ContactoCategory } from '../../../../services/contactos';

@Component({
  selector: 'app-editar-contacto',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-contacto.component.html',
  styleUrl: './editar-contacto.component.css',
})
export class EditarContactoComponent implements OnInit {
  private readonly contactosService = inject(Contactos);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    type:     ['', [Validators.required]],
    value:    ['', [Validators.required]],
    icon:     ['', [Validators.required]],
    category: ['footer', [Validators.required]],
  });

  contactoId = 0;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.contactoId = Number(this.route.snapshot.paramMap.get('id'));

    this.contactosService.lerPorId(this.contactoId).subscribe({
      next: (contacto) => {
        this.form.patchValue({
          type:     contacto.type,
          value:    contacto.value,
          icon:     contacto.icon,
          category: contacto.category ?? 'footer',
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => this.router.navigate(['/admin/contactos']),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contactosService.editar({
      id:       this.contactoId,
      type:     this.form.controls.type.value ?? '',
      value:    this.form.controls.value.value ?? '',
      icon:     this.form.controls.icon.value ?? '',
      category: (this.form.controls.category.value ?? 'footer') as ContactoCategory,
    }).subscribe({
      next: () => {
        this.successMessage = 'Contacto atualizado com sucesso.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao atualizar o contacto.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }
}
