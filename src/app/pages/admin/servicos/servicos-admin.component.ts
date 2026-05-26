import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Servicos, ServicoItemAdmin } from '../../../services/servicos';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-servicos-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicos-admin.component.html',
  styleUrl: './servicos-admin.component.css',
})
export class ServicosAdminComponent implements OnInit {
  private readonly servicosService = inject(Servicos);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  servicos: ServicoItemAdmin[] = [];
  isLoading = true;
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
      this.cdr.markForCheck();
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

  async toggle(s: ServicoItemAdmin): Promise<void> {
    const acao = s.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} o serviço "${s.title}"?`);
    if (!ok) return;

    this.servicosService.toggle(s.id).subscribe({
      next: () => {
        this.notify.success('Estado do serviço alterado.');
        this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.');
      },
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
  }
}
