import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Servicos } from '../../../../services/servicos';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-editar-servico',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-servico.component.html',
  styleUrl: './editar-servico.component.css',
})
export class EditarServicoComponent implements OnInit {
  private readonly servicosService = inject(Servicos);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    title:         ['', [Validators.required]],
    description:   ['', [Validators.required]],
    icon_or_image: ['', [Validators.required]],
  });

  servicoId = 0;
  isLoading = true;
  isSubmitting = false;

  ngOnInit(): void {
    this.servicoId = Number(this.route.snapshot.paramMap.get('id'));

    this.servicosService.lerPorId(this.servicoId).subscribe({
      next: (servico) => {
        this.form.patchValue({
          title:         servico.title,
          description:   servico.description,
          icon_or_image: servico.icon_or_image,
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => this.router.navigate(['/admin/servicos']),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.servicosService.editar({
      id:            this.servicoId,
      title:         this.form.controls.title.value ?? '',
      description:   this.form.controls.description.value ?? '',
      icon_or_image: this.form.controls.icon_or_image.value ?? '',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Serviço atualizado com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar o serviço.');
      },
    });
  }
}
