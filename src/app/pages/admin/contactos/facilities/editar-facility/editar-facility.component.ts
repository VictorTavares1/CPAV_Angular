import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FacilitiesService, FacilityCategory, FacilityServiceItem, ServiceKey } from '../../../../../services/facilities.service';
import { NotifyService } from '../../../../../services/notify.service';

const SERVICE_KEY_LABELS: Record<string, string> = {
  'pre-escolar':          'Pré-Escolar',
  'catl':                 'C.A.T.L.',
  'sad':                  'SAD',
  'paragem':              'P.A.R.A.G.E.M.',
  'apoio-estudo':         'Apoio ao Estudo',
  'nossa-senhora-belem':  'Nossa Senhora de Belém',
};

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
    tel:               ['', [Validators.pattern(/^\d*$/), Validators.maxLength(9)]],
    mobile:            ['', [Validators.pattern(/^\d*$/), Validators.maxLength(9)]],
    email:             ['', [Validators.email]],
    responsavel_nome:  [''],
    responsavel_cargo: [''],
    linked_facility:   [''],
    services:          [''],
    sort_order:        [0],
  });

  // service associations
  serviceAssociations: FacilityServiceItem[] = [];
  serviceKeys = Object.keys(SERVICE_KEY_LABELS) as ServiceKey[];
  serviceKeyLabels = SERVICE_KEY_LABELS;

  showAddServiceForm = false;
  editingServiceId: number | null = null;
  readonly serviceForm = this.fb.group({
    service_key:  ['' as ServiceKey, [Validators.required]],
    description:  [''],
    note:         [''],
    sort_order:   [0],
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

    this.loadServiceAssociations();
  }

  loadServiceAssociations(): void {
    this.facilitiesService.lerServicosDaFacility(this.facilityId).subscribe(rows => {
      this.serviceAssociations = rows;
      this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar.');
        this.cdr.markForCheck();
      },
    });
  }

  startAddService(): void {
    this.editingServiceId = null;
    this.serviceForm.reset({ service_key: '' as ServiceKey, description: '', note: '', sort_order: 0 });
    this.showAddServiceForm = true;
    this.cdr.markForCheck();
  }

  startEditService(item: FacilityServiceItem): void {
    this.editingServiceId = item.id;
    this.serviceForm.patchValue({
      service_key:  item.service_key,
      description:  item.description ?? '',
      note:         item.note ?? '',
      sort_order:   item.sort_order,
    });
    this.showAddServiceForm = true;
    this.cdr.markForCheck();
  }

  cancelServiceForm(): void {
    this.showAddServiceForm = false;
    this.editingServiceId = null;
    this.cdr.markForCheck();
  }

  submitServiceForm(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const sv = this.serviceForm.controls;
    const description = sv.description.value?.trim() || null;
    const note        = sv.note.value?.trim() || null;
    const sort_order  = Number(sv.sort_order.value ?? 0);
    const service_key = sv.service_key.value as ServiceKey;

    if (this.editingServiceId !== null) {
      this.facilitiesService.editarServico({
        id:          this.editingServiceId,
        id_facility: this.facilityId,
        service_key,
        description,
        note,
        sort_order,
      }).subscribe({
        next: () => {
          this.notify.success('Associação atualizada.');
          this.showAddServiceForm = false;
          this.editingServiceId = null;
          this.loadServiceAssociations();
        },
        error: (err) => this.notify.error(err?.error?.message ?? 'Erro ao atualizar.'),
      });
    } else {
      this.facilitiesService.inserirServico({
        id_facility: this.facilityId,
        service_key,
        description,
        note,
        sort_order,
      }).subscribe({
        next: () => {
          this.notify.success('Associação criada.');
          this.showAddServiceForm = false;
          this.loadServiceAssociations();
        },
        error: (err) => this.notify.error(err?.error?.message ?? 'Erro ao criar.'),
      });
    }
  }

  async deleteService(item: FacilityServiceItem): Promise<void> {
    const label = SERVICE_KEY_LABELS[item.service_key] ?? item.service_key;
    const ok = await this.notify.confirm(`Remover associação com "${label}"?`);
    if (!ok) return;

    this.facilitiesService.apagarServico(item.id).subscribe({
      next: () => {
        this.notify.success('Associação removida.');
        this.loadServiceAssociations();
      },
      error: (err) => this.notify.error(err?.error?.message ?? 'Erro ao remover.'),
    });
  }
}
