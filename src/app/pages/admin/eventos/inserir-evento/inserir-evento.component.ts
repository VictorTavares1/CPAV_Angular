import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, LocalizacaoItem } from '../../../../services/eventos.service';
import { NotifyService } from '../../../../services/notify.service';

function dataFuturaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const chosen = new Date(control.value + 'T00:00:00');
  return chosen < today ? { dataPassada: true } : null;
}

@Component({
  selector: 'app-inserir-evento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-evento.component.html',
  styleUrl: './inserir-evento.component.css',
})
export class InserirEventoComponent implements OnInit {
  private readonly eventosService = inject(EventosService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // Data de hoje em formato YYYY-MM-DD para o atributo [min] do input date
  readonly today = new Date().toISOString().split('T')[0];

  readonly form = this.fb.group({
    title:      ['', [Validators.required]],
    idLocation: ['', [Validators.required]],
    event_date: ['', [Validators.required, dataFuturaValidator]],
    end_date:   [''],
    event_time: ['', [Validators.required]],
  });

  get minEndDate(): string {
    const d = this.form.controls.event_date.value;
    if (!d) return this.today;
    const next = new Date(d + 'T00:00:00');
    next.setDate(next.getDate() + 1);
    return next.toISOString().split('T')[0];
  }

  get maxEndDate(): string {
    const d = this.form.controls.event_date.value;
    if (!d) return '';
    const max = new Date(d + 'T00:00:00');
    max.setDate(max.getDate() + 7);
    return max.toISOString().split('T')[0];
  }

  localizacoes: LocalizacaoItem[] = [];
  isSubmitting = false;

  ngOnInit(): void {
    this.eventosService.lerLocalizacoes().subscribe(l => {
      this.localizacoes = l;
      this.cdr.markForCheck();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const end = this.form.controls.end_date.value || undefined;
    this.eventosService.inserir({
      title:      this.form.controls.title.value ?? '',
      event_date: this.form.controls.event_date.value ?? '',
      ...(end ? { end_date: end } : {}),
      event_time: this.form.controls.event_time.value ?? '',
      idLocation: Number(this.form.controls.idLocation.value),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        this.notify.success('Evento inserido com sucesso.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao inserir o evento.');
        this.cdr.markForCheck();
      },
    });
  }
}
