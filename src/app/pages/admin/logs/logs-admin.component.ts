import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogItem, LogsService, Operation } from '../../../services/logs.service';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-logs-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './logs-admin.component.html',
  styleUrl: './logs-admin.component.css',
})
export class LogsAdminComponent implements OnInit, OnDestroy {
  private readonly logsService = inject(LogsService);
  private readonly dateChange$ = new Subject<void>();
  private readonly dateSub = new Subscription();

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
  dropdownOpen = false;

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('.op-dropdown')) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(e: MouseEvent): void {
    e.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOperation(id: number, e: MouseEvent): void {
    e.stopPropagation();
    this.operationId = id;
    this.dropdownOpen = false;
    this.onOperationChange();
  }

  get selectedLabel(): string {
    if (this.operationId === 0) return 'Todas as operações';
    for (const g of this.groupedOps) {
      const op = g.items.find(o => o.id === this.operationId);
      if (op) return op.title;
    }
    return 'Todas as operações';
  }

  ngOnInit(): void {
    this.dateSub.add(
      this.dateChange$.pipe(debounceTime(400)).subscribe(() => this.applyFilters())
    );
    this.load();
  }

  ngOnDestroy(): void {
    this.dateSub.unsubscribe();
    this.dateChange$.complete();
  }

  onOperationChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.dateChange$.next();
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

  get groupedOps(): { label: string; items: Operation[] }[] {
    const buckets: { label: string; keywords: string[] }[] = [
      { label: 'Notícias',   keywords: ['notíci', 'notici'] },
      { label: 'Relatórios', keywords: ['relat'] },
      { label: 'Eventos',    keywords: ['event'] },
      { label: 'Imagens',    keywords: ['imag'] },
      { label: 'Contactos',  keywords: ['contact'] },
      { label: 'Serviços',   keywords: ['servi'] },
      { label: 'Conteúdos',  keywords: ['conteúd', 'conteud', 'página', 'pagina'] },
      { label: 'Sessão',     keywords: ['login', 'logout', 'sessão'] },
    ];

    const map = new Map<string, Operation[]>();
    for (const op of this.operations()) {
      const t = op.title.toLowerCase();
      const bucket = buckets.find(b => b.keywords.some(k => t.includes(k)));
      const label = bucket?.label ?? 'Outros';
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(op);
    }

    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }
}
