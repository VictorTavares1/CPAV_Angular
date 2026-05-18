import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    this.doc.body.style.paddingTop = '0';
    this.doc.body.style.backgroundColor = '#072d5c';
  }

  ngOnDestroy(): void {
    this.doc.body.style.paddingTop = '';
    this.doc.body.style.backgroundColor = '';
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
