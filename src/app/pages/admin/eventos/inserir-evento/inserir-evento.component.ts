import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, LocalizacaoItem } from '../../../../services/eventos.service';
import { NotifyService } from '../../../../services/notify.service';

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

  readonly form = this.fb.group({
    title:      ['', [Validators.required]],
    idLocation: ['', [Validators.required]],
    event_date: ['', [Validators.required]],
    event_time: ['', [Validators.required]],
  });

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

    this.eventosService.inserir({
      title:      this.form.controls.title.value ?? '',
      event_date: this.form.controls.event_date.value ?? '',
      event_time: this.form.controls.event_time.value ?? '',
      idLocation: Number(this.form.controls.idLocation.value),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        this.notify.success('Evento inserido com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao inserir o evento.');
      },
    });
  }
}
