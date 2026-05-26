import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  counts = {
    noticias: 0,
    eventos: 0,
    servicos: 0,
    contactos: 0,
    relatorios: 0,
  };

  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin;
  }

  ngOnInit(): void {
    forkJoin({
      noticias: this.dashboardService.getNoticiasCount(),
      eventos: this.dashboardService.getEventosCount(),
      servicos: this.dashboardService.getServicosCount(),
      contactos: this.dashboardService.getContactosCount(),
      relatorios: this.dashboardService.getRelatoriosCount(),
    }).subscribe((counts) => {
      this.counts = counts;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
