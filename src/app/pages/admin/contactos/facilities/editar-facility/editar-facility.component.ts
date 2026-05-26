import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FacilitiesService, FacilityCategory } from '../../../../../services/facilities.service';
import { NotifyService } from '../../../../../services/notify.service';

@Component({
  selector: 'app-editar-facility',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-facility.component.html',
  styleUrl: './editar-facility.component.css',
})
export class EditarFacilityComponent implements OnInit {
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  facilityId = 0;
  isLoading = true;
  isSubmitting = false;

  readonly form = this.fb.group({
    category:          ['instalacao', [Validators.required]],
    name:              ['', [Validators.required]],
    icon:              [''],
    address:           [''],
    tel:               [''],
    mobile:            [''],
    email:             [''],
    responsavel_nome:  [''],
    responsavel_cargo: [''],
    linked_facility:   [''],
    services:          [''],
    sort_order:        [0],
  });

  ngOnInit(): void {
    this.facilityId = Number(this.route.snapshot.paramMap.get('id'));

    this.facilitiesService.lerPorId(this.facilityId).subscribe({
      next: (f) => {
        this.form.patchValue({
          category:          f.category,
          name:              f.name,
          icon:              f.icon              ?? '',
          address:           f.address           ?? '',
          tel:               f.tel               ?? '',
          mobile:            f.mobile            ?? '',
          email:             f.email             ?? '',
          responsavel_nome:  f.responsavel_nome  ?? '',
          responsavel_cargo: f.responsavel_cargo ?? '',
          linked_facility:   f.linked_facility   ?? '',
          services:          f.services          ?? '',
          sort_order:        f.sort_order        ?? 0,
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

    const v = this.form.controls;
    this.facilitiesService.editar({
      id:                this.facilityId,
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
        this.notify.success('Registo atualizado com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar.');
      },
    });
  }
}
