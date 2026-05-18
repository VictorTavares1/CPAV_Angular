import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogItem, LogsService, Operation } from '../../../services/logs.service';

@Component({
  selector: 'app-logs-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './logs-admin.component.html',
  styleUrl: './logs-admin.component.css',
})
export class LogsAdminComponent implements OnInit {
  private readonly logsService = inject(LogsService);

  logs = signal<LogItem[]>([]);
  operations = signal<Operation[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  currentPage = signal(1);
  totalPages = signal(1);
  total = signal(0);
  readonly perPage = 10;

  operationId = 0;
  dateFrom = '';
  dateTo = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.logsService.listar({
      page: this.currentPage(),
      perPage: this.perPage,
      operationId: this.operationId || undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
    }).subscribe({
      next: (res) => {
        this.logs.set(res.data);
        this.operations.set(res.operations);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erro ao carregar os logs.');
        this.isLoading.set(false);
      },
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.load();
  }

  clearFilters(): void {
    this.operationId = 0;
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
  }

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.load();
  }

  affectedItem(log: LogItem): string {
    return log.alvoTitle ?? '—';
  }
}
