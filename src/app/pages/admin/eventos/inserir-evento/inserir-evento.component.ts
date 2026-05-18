import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, LocalizacaoItem } from '../../../../services/eventos.service';

@Component({
  selector: 'app-inserir-evento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-evento.component.html',
  styleUrl: './inserir-evento.component.css',
})
export class InserirEventoComponent implements OnInit {
  private readonly eventosService = inject(EventosService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title:      ['', [Validators.required]],
    idLocation: ['', [Validators.required]],
    event_date: ['', [Validators.required]],
    event_time: ['', [Validators.required]],
  });

  localizacoes: LocalizacaoItem[] = [];
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.eventosService.lerLocalizacoes().subscribe(l => this.localizacoes = l);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.eventosService.inserir({
      title:      this.form.controls.title.value ?? '',
      event_date: this.form.controls.event_date.value ?? '',
      event_time: this.form.controls.event_time.value ?? '',
      idLocation: Number(this.form.controls.idLocation.value),
    }).subscribe({
      next: () => {
        this.successMessage = 'Evento inserido com sucesso.';
        this.isSubmitting = false;
        this.form.reset();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao inserir o evento.';
        this.isSubmitting = false;
      },
    });
  }
}
