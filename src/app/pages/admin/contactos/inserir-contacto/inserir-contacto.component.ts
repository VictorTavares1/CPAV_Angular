import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Contactos } from '../../../../services/contactos';
import { NotifyService } from '../../../../services/notify.service';

const PHONE_TYPES = ['Telefone Geral', 'Telemóvel'];

@Component({
  selector: 'app-inserir-contacto',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-contacto.component.html',
  styleUrl: './inserir-contacto.component.css',
})
export class InserirContactoComponent {
  private readonly contactosService = inject(Contactos);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    type:  ['', [Validators.required]],
    value: ['', [Validators.required]],
    icon:  ['', [Validators.required]],
  });

  constructor() {
    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe(type => {
      this.updateValueValidators(type ?? '');
    });
  }

  private updateValueValidators(type: string): void {
    const ctrl = this.form.controls.value;
    if (PHONE_TYPES.includes(type)) {
      ctrl.setValidators([Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(9)]);
    } else if (type === 'Email') {
      ctrl.setValidators([Validators.required, Validators.email]);
    } else {
      ctrl.setValidators([Validators.required]);
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
    this.cdr.markForCheck();
  }

  isSubmitting = false;

  readonly iconOptions = [
    { cls: 'fa-solid fa-phone',                label: 'Telefone' },
    { cls: 'fa-solid fa-mobile-screen-button', label: 'Telemóvel' },
    { cls: 'fa-solid fa-envelope',             label: 'Email' },
    { cls: 'fa-solid fa-location-dot',         label: 'Morada' },
  ];

  selectIcon(cls: string): void {
    this.form.controls.icon.setValue(cls);
    this.form.controls.icon.markAsTouched();
  }

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
      category: 'footer',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Contacto inserido com sucesso.');
        this.router.navigate(['/admin/contactos']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.notify.error(err?.error?.message ?? 'Erro ao inserir o contacto.');
      },
    });
  }
}
