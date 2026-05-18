import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly router = inject(Router);

  menuOpen = false;

  isInstituicaoActive(): boolean {
    return this.router.url.startsWith('/sobre-nos') || this.router.url.startsWith('/relatorios');
  }

  isServicosActive(): boolean {
    return this.router.url.startsWith('/servicos');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }
}