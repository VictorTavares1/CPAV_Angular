import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Servicos, ServicoItemAdmin } from '../../../services/servicos';

@Component({
  selector: 'app-servicos-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicos-admin.component.html',
  styleUrl: './servicos-admin.component.css',
})
export class ServicosAdminComponent implements OnInit {
  private readonly servicosService = inject(Servicos);
  private readonly cdr = inject(ChangeDetectorRef);

  servicos: ServicoItemAdmin[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  searchQuery = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.servicosService.listarAdmin().subscribe(rows => {
      this.servicos = rows;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  get filtered(): ServicoItemAdmin[] {
    return this.servicos.filter(s => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || s.title.toLowerCase().includes(q);
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && s.idState === 1) ||
        (this.selectedStatus === '2' && s.idState !== 1);
      return matchSearch && matchStatus;
    });
  }

  toggle(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.servicosService.toggle(id).subscribe({
      next: () => {
        this.successMessage = 'Estado do serviço alterado.';
        this.load();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao alterar estado.';
      },
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
  }
}
