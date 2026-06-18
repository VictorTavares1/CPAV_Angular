import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticiaItem, Noticias } from '../../../services/noticias';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-noticias-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './noticias-admin.component.html',
  styleUrl: './noticias-admin.component.css',
})
export class NoticiasAdminComponent implements OnInit {
  private readonly noticiasService = inject(Noticias);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  noticias: NoticiaItem[] = [];
  isLoading = true;

  searchQuery = '';
  selectedStatus = '';

  currentPage = 1;
  readonly perPage = 10;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.noticiasService.listarAdmin().subscribe({
      next: (rows) => {
        this.noticias = rows;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.notify.error(err?.error?.message ?? 'Erro ao carregar notícias.');
      },
    });
  }

  get filtered(): NoticiaItem[] {
    return this.noticias.filter(n => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q);
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && n.idState === 1) ||
        (this.selectedStatus === '2' && n.idState !== 1);
      return matchSearch && matchStatus;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.perPage));
  }

  get paginated(): NoticiaItem[] {
    const page = Math.min(this.currentPage, this.totalPages);
    const start = (page - 1) * this.perPage;
    return this.filtered.slice(start, start + this.perPage);
  }

  goTo(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
  }

  resetPage(): void {
    this.currentPage = 1;
  }

  async toggle(n: NoticiaItem): Promise<void> {
    const idStateAtual = n.idState ?? 1;
    const acao = idStateAtual === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} a notícia "${n.title}"?`);
    if (!ok) return;

    this.noticiasService.toggle(n.id).subscribe({
      next: () => {
        this.notify.success('Estado da notícia alterado.');
        this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar o estado.');
      },
    });
  }

  fmtDate(d?: string): string {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('pt-PT') + ' ' + dt.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.resetPage();
  }
}
