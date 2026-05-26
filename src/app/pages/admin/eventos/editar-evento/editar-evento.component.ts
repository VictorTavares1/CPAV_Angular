import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, LocalizacaoItem } from '../../../../services/eventos.service';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-editar-evento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css',
})
export class EditarEventoComponent implements OnInit {
  private readonly eventosService = inject(EventosService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    title:      ['', [Validators.required]],
    idLocation: ['', [Validators.required]],
    event_date: ['', [Validators.required]],
    event_time: ['', [Validators.required]],
  });

  localizacoes: LocalizacaoItem[] = [];
  eventoId = 0;
  isLoading = true;
  isSubmitting = false;

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));

    this.eventosService.lerLocalizacoes().subscribe(l => {
      this.localizacoes = l;
      this.cdr.markForCheck();
    });

    this.eventosService.lerPorId(this.eventoId).subscribe({
      next: (evento) => {
        if (!evento) {
          this.router.navigate(['/admin/eventos']);
          return;
        }
        this.form.patchValue({
          title:      evento.title,
          idLocation: String(evento.idLocation),
          event_date: evento.event_date,
          event_time: evento.event_time?.substring(0, 5) ?? '',
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => this.router.navigate(['/admin/eventos']),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.eventosService.editar({
      id:         this.eventoId,
      title:      this.form.controls.title.value ?? '',
      event_date: this.form.controls.event_date.value ?? '',
      event_time: this.form.controls.event_time.value ?? '',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Evento atualizado com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar o evento.');
      },
    });
  }
}
