import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RelatorioItemAdmin, RelatoriosService, TipoItem } from '../../../services/relatorios.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-relatorios-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './relatorios-admin.component.html',
  styleUrl: './relatorios-admin.component.css',
})
export class RelatoriosAdminComponent implements OnInit {
  private readonly relatoriosService = inject(RelatoriosService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  relatorios: RelatorioItemAdmin[] = [];
  tipos: TipoItem[] = [];
  isLoading = true;

  searchQuery = '';
  selectedType = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.relatoriosService.listarAdmin().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(rows => {
      this.relatorios = rows;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
    this.relatoriosService.lerTipos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(tipos => {
      this.tipos = tipos;
      this.cdr.markForCheck();
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

  async toggle(r: RelatorioItemAdmin): Promise<void> {
    const acao = r.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} o relatório "${r.title}"?`);
    if (!ok) return;

    this.relatoriosService.toggle(r.id).subscribe({
      next: () => {
        this.notify.success('Estado do relatório alterado.');
        this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.');
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
