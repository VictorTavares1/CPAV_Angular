import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, LocalizacaoItem } from '../../../../services/eventos.service';

@Component({
  selector: 'app-editar-evento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css',
})
export class EditarEventoComponent implements OnInit {
  private readonly eventosService = inject(EventosService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    title:      ['', [Validators.required]],
    idLocation: ['', [Validators.required]],
    event_date: ['', [Validators.required]],
    event_time: ['', [Validators.required]],
  });

  localizacoes: LocalizacaoItem[] = [];
  eventoId = 0;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));

    this.eventosService.lerLocalizacoes().subscribe(l => this.localizacoes = l);

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
    this.errorMessage = '';
    this.successMessage = '';

    this.eventosService.editar({
      id:         this.eventoId,
      title:      this.form.controls.title.value ?? '',
      event_date: this.form.controls.event_date.value ?? '',
      event_time: this.form.controls.event_time.value ?? '',
    }).subscribe({
      next: () => {
        this.successMessage = 'Evento atualizado com sucesso.';
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao atualizar o evento.';
        this.isSubmitting = false;
      },
    });
  }
}
