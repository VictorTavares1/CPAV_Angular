import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Contactos } from '../../../../services/contactos';
import { NotifyService } from '../../../../services/notify.service';

const PHONE_TYPES = ['Telefone Geral', 'Telemóvel'];

@Component({
  selector: 'app-editar-contacto',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-contacto.component.html',
  styleUrl: './editar-contacto.component.css',
})
export class EditarContactoComponent implements OnInit {
  private readonly contactosService = inject(Contactos);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    type:  ['', [Validators.required]],
    value: ['', [Validators.required]],
    icon:  ['', [Validators.required]],
  });

  contactoId = 0;
  isLoading = true;
  isSubmitting = false;

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

  // Ícones FontAwesome disponíveis para escolher (galeria visual)
  readonly iconOptions = [
    { cls: 'fa-solid fa-phone',                 label: 'Telefone' },
    { cls: 'fa-solid fa-mobile-screen-button',  label: 'Telemóvel' },
    { cls: 'fa-solid fa-envelope',              label: 'Email' },
    { cls: 'fa-solid fa-location-dot',          label: 'Morada' },
  ];

  selectIcon(cls: string): void {
    this.form.controls.icon.setValue(cls);
    this.form.controls.icon.markAsTouched();
  }

  ngOnInit(): void {
    this.contactoId = Number(this.route.snapshot.paramMap.get('id'));

    this.contactosService.lerPorId(this.contactoId).subscribe({
      next: (contacto) => {
        this.updateValueValidators(contacto.type);
        this.form.patchValue({
          type:  contacto.type,
          value: contacto.value,
          icon:  contacto.icon,
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

    this.contactosService.editar({
      id:       this.contactoId,
      type:     this.form.controls.type.value ?? '',
      value:    this.form.controls.value.value ?? '',
      icon:     this.form.controls.icon.value ?? '',
      category: 'footer',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Contacto atualizado com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar o contacto.');
      },
    });
  }
}
