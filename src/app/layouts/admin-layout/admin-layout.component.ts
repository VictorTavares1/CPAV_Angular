import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  sidebarOpen = signal(false);

  constructor() {
    this.doc.body.style.paddingTop = '0';
    this.doc.body.style.backgroundColor = '#072d5c';
  }

  ngOnDestroy(): void {
    this.doc.body.style.paddingTop = '';
    this.doc.body.style.backgroundColor = '';
  }

  get userEmail(): string {
    return this.authService.currentUser?.email ?? '';
  }

  get userInitial(): string {
    return this.userEmail.charAt(0).toUpperCase();
  }

  get userRoleLabel(): string {
    const role = this.authService.currentUser?.role;
    return role === 'super_admin' ? 'Super Admin' : 'Administrador';
  }

  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin;
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
