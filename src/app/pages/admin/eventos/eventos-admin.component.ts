import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventoItemAdmin, EventosService } from '../../../services/eventos.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-eventos-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './eventos-admin.component.html',
  styleUrl: './eventos-admin.component.css',
})
export class EventosAdminComponent implements OnInit {
  private readonly eventosService = inject(EventosService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  eventos: EventoItemAdmin[] = [];
  isLoading = true;

  searchQuery = '';
  selectedStatus = '';
  dateFrom = '';
  dateTo = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.eventosService.listarAdmin().subscribe(rows => {
      this.eventos = rows;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  get filtered(): EventoItemAdmin[] {
    return this.eventos.filter(e => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || e.title.toLowerCase().includes(q);
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && e.idState === 1) ||
        (this.selectedStatus === '2' && e.idState !== 1);
      const matchFrom = !this.dateFrom || e.event_date >= this.dateFrom;
      const matchTo   = !this.dateTo   || e.event_date <= this.dateTo;
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }

  async toggle(e: EventoItemAdmin): Promise<void> {
    const acao = e.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} o evento "${e.title}"?`);
    if (!ok) return;

    this.eventosService.toggle(e.id).subscribe({
      next: () => {
        this.notify.success('Estado do evento alterado.');
        this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.');
      },
    });
  }

  fmtDate(d: string): string {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  fmtTime(t: string): string {
    return t ? t.substring(0, 5) : '';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.dateFrom = '';
    this.dateTo = '';
  }
}
