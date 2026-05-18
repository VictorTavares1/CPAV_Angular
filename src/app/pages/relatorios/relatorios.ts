import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RelatorioItem, RelatoriosService } from '../../services/relatorios.service';

@Component({
  selector: 'app-relatorios',
  imports: [FormsModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class Relatorios {
  private readonly relatoriosService = inject(RelatoriosService);

  readonly searchQuery = signal('');

  private readonly allRelatorios = toSignal(this.relatoriosService.listar());

  readonly loading = computed(() => this.allRelatorios() === undefined);

  readonly tipos = computed(() => {
    const all = this.allRelatorios() ?? [];
    return [...new Set(all.map((r) => r.typeName))].sort();
  });

  readonly filtered = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.allRelatorios() ?? [];
    if (!q) return all;
    return all.filter((r) => r.title.toLowerCase().includes(q));
  });

  readonly porTipo = computed(() => {
    const grupos: Record<string, RelatorioItem[]> = {};
    for (const r of this.filtered()) {
      if (!grupos[r.typeName]) grupos[r.typeName] = [];
      grupos[r.typeName].push(r);
    }
    return grupos;
  });

  pdfUrl(filename: string): string {
    return this.relatoriosService.pdfUrl(filename);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
