import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserItem, UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-users-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.css',
})
export class UsersAdminComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  users: UserItem[] = [];
  isLoading = true;

  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.usersService.listar().subscribe(rows => {
      this.users = rows;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  get filtered(): UserItem[] {
    return this.users.filter(u => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || u.email.toLowerCase().includes(q);
      const matchRole = !this.selectedRole || u.role === this.selectedRole;
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && u.idState === 1) ||
        (this.selectedStatus === '2' && u.idState !== 1);
      return matchSearch && matchRole && matchStatus;
    });
  }

  isMe(u: UserItem): boolean {
    return this.authService.currentUser?.idUser === u.id;
  }

  // Pode editar/toggle se for ele próprio OU se o alvo não for super_admin
  canAct(u: UserItem): boolean {
    return this.isMe(u) || u.role !== 'super_admin';
  }

  roleLabel(role: string): string {
    return role === 'super_admin' ? 'Super-Admin' : 'Admin';
  }

  async toggle(u: UserItem): Promise<void> {
    if (this.isMe(u)) {
      this.notify.warning('Não pode desativar a sua própria conta.');
      return;
    }
    const acao = u.idState === 1 ? 'desativar' : 'ativar';
    const ok = await this.notify.confirm(`Pretende ${acao} o utilizador "${u.email}"?`);
    if (!ok) return;

    this.usersService.toggle(u.id).subscribe({
      next: () => {
        this.notify.success('Estado do utilizador alterado.');
        this.load();
      },
      error: (err) => {
        this.notify.error(err?.error?.message ?? 'Erro ao alterar estado.');
      },
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }
}
