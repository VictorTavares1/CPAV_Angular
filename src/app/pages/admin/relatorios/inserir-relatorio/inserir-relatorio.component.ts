import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RelatoriosService, TipoItem } from '../../../../services/relatorios.service';

@Component({
  selector: 'app-inserir-relatorio',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-relatorio.component.html',
  styleUrl: './inserir-relatorio.component.css',
})
export class InserirRelatorioComponent implements OnInit {
  private readonly relatoriosService = inject(RelatoriosService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title:  ['', [Validators.required]],
    idType: ['', [Validators.required]],
  });

  tipos: TipoItem[] = [];
  selectedFile: File | null = null;
  fileError = '';
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.relatoriosService.lerTipos().subscribe(t => this.tipos = t);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';
    this.selectedFile = null;

    if (!input.files?.length) return;

    const file = input.files[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (file.type !== 'application/pdf') {
      this.fileError = 'Apenas ficheiros PDF são permitidos.';
      input.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.fileError = 'O ficheiro é demasiado grande. O tamanho máximo é 10 MB.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.fileError = 'O ficheiro PDF é obrigatório.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title',  this.form.controls.title.value ?? '');
    formData.append('idType', this.form.controls.idType.value ?? '');
    formData.append('file',   this.selectedFile);

    this.relatoriosService.inserir(formData).subscribe({
      next: () => {
        this.successMessage = 'Relatório inserido com sucesso.';
        this.isSubmitting = false;
        this.form.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao inserir o relatório.';
        this.isSubmitting = false;
      },
    });
  }
}
