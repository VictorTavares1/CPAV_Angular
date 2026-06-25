import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocaizacoesService, LocalizacaoAdminItem } from '../../../../services/localizacoes.service';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-localizacoes-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './localizacoes-admin.component.html',
  styleUrl: './localizacoes-admin.component.css',
})
export class LocalizacoesAdminComponent implements OnInit {
  private readonly locService = inject(LocaizacoesService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  localizacoes: LocalizacaoAdminItem[] = [];
  isLoading = true;

  // Formulário de inserir nova localização
  novoNome = '';
  isInserting = false;

  // Edição inline
  editState: Record<number, { editing: boolean; value: string; saving: boolean }> = {};

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.locService.listarAdmin().subscribe(rows => {
      this.localizacoes = rows;
      this.editState = {};
      rows.forEach(r => {
        this.editState[r.id] = { editing: false, value: r.name, saving: false };
      });
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  inserir(): void {
    const nome = this.novoNome.trim();
    if (!nome) { this.notify.warning('Indica o nome da localização.'); return; }
    this.isInserting = true;
    this.locService.inserir(nome).subscribe({
      next: () => {
        this.novoNome = '';
        this.isInserting = false;
        this.notify.success('Localização adicionada.');
        this.load();
      },
      error: (err) => {
        this.isInserting = false;
        this.cdr.markForCheck();
        this.notify.error(err?.error?.message ?? 'Erro ao inserir.');
      },
    });
  }

  startEdit(loc: LocalizacaoAdminItem): void {
    this.editState[loc.id].editing = true;
    this.editState[loc.id].value = loc.name;
  }

  cancelEdit(loc: LocalizacaoAdminItem): void {
    this.editState[loc.id].editing = false;
    this.editState[loc.id].value = loc.name;
  }

  save(loc: LocalizacaoAdminItem): void {
    const state = this.editState[loc.id];
    const nome = state.value.trim();
    if (!nome) { this.notify.warning('O nome não pode estar vazio.'); return; }
    state.saving = true;
    this.locService.editar(loc.id, nome).subscribe({
      next: () => {
        loc.name = nome;
        state.editing = false;
        state.saving = false;
        this.notify.success('Localização atualizada.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        state.saving = false;
        this.cdr.markForCheck();
        this.notify.error(err?.error?.message ?? 'Erro ao guardar.');
      },
    });
  }

  async toggle(loc: LocalizacaoAdminItem): Promise<void> {
    const acao = loc.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} a localização "${loc.name}"?`);
    if (!ok) return;
    this.locService.toggle(loc.id).subscribe({
      next: () => { this.notify.success('Estado alterado.'); this.load(); },
      error: (err) => this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.'),
    });
  }
}
