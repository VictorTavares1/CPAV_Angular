import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RelatorioItemAdmin, RelatoriosService, TipoItem } from '../../../services/relatorios.service';

@Component({
  selector: 'app-relatorios-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './relatorios-admin.component.html',
  styleUrl: './relatorios-admin.component.css',
})
export class RelatoriosAdminComponent implements OnInit {
  private readonly relatoriosService = inject(RelatoriosService);
  private readonly cdr = inject(ChangeDetectorRef);

  relatorios: RelatorioItemAdmin[] = [];
  tipos: TipoItem[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  searchQuery = '';
  selectedType = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.relatoriosService.listarAdmin().subscribe(rows => {
      this.relatorios = rows;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
    this.relatoriosService.lerTipos().subscribe(tipos => {
      this.tipos = tipos;
      this.cdr.detectChanges();
    });
  }

  get filtered(): RelatorioItemAdmin[] {
    return this.relatorios.filter(r => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || r.title.toLowerCase().includes(q);
      const matchType = !this.selectedType || r.typeName === this.selectedType;
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && r.idState === 1) ||
        (this.selectedStatus === '2' && r.idState !== 1);
      return matchSearch && matchType && matchStatus;
    });
  }

  toggle(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.relatoriosService.toggle(id).subscribe({
      next: () => {
        this.successMessage = 'Estado do relatório alterado.';
        this.load();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao alterar estado.';
      },
    });
  }

  pdfUrl(filename: string): string {
    return this.relatoriosService.pdfUrl(filename);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedStatus = '';
  }
}
