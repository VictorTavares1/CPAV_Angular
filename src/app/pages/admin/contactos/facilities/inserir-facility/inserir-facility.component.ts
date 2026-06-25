import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FacilitiesService, FacilityCategory } from '../../../../../services/facilities.service';
import { NotifyService } from '../../../../../services/notify.service';

@Component({
  selector: 'app-inserir-facility',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-facility.component.html',
  styleUrl: './inserir-facility.component.css',
})
export class InserirFacilityComponent {
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    category:          ['instalacao', [Validators.required]],
    name:              ['', [Validators.required]],
    icon:              [''],
    address:           [''],
    tel:               ['', [Validators.pattern(/^\d*$/), Validators.maxLength(9)]],
    mobile:            ['', [Validators.pattern(/^\d*$/), Validators.maxLength(9)]],
    email:             ['', [Validators.email]],
    responsavel_nome:  [''],
    responsavel_cargo: [''],
    linked_facility:   [''],
    services:          [''],
    sort_order:        [0],
  });

  isSubmitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const v = this.form.controls;
    this.facilitiesService.inserir({
      category:          (v.category.value ?? 'instalacao') as FacilityCategory,
      name:              v.name.value ?? '',
      icon:              v.icon.value || null,
      address:           v.address.value || null,
      tel:               v.tel.value || null,
      mobile:            v.mobile.value || null,
      email:             v.email.value || null,
      responsavel_nome:  v.responsavel_nome.value || null,
      responsavel_cargo: v.responsavel_cargo.value || null,
      linked_facility:   v.linked_facility.value || null,
      services:          v.services.value || null,
      sort_order:        Number(v.sort_order.value ?? 0),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Registo inserido com sucesso.');
        setTimeout(() => this.router.navigate(['/admin/contactos']), 600);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao inserir.');
      },
    });
  }
}
