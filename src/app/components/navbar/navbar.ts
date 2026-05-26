import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

type SubmenuName = 'instituicao' | 'servicos';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly router = inject(Router);

  menuOpen = false;
  activeSubmenu: SubmenuName | null = null;

  isInstituicaoActive(): boolean {
    return this.router.url.startsWith('/sobre-nos') || this.router.url.startsWith('/relatorios');
  }

  isServicosActive(): boolean {
    return this.router.url.startsWith('/servicos');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) {
      this.activeSubmenu = null;
    }
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menuOpen = false;
    this.activeSubmenu = null;
    document.body.style.overflow = '';
  }

  openSubmenu(name: SubmenuName, event: Event) {
    // Em mobile, abre o painel lateral. Em desktop, o hover já trata disto, mas
    // o clique no botão não deve navegar nem perturbar o comportamento.
    event.preventDefault();
    this.activeSubmenu = name;
  }

  closeSubmenu() {
    this.activeSubmenu = null;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.activeSubmenu) {
      this.closeSubmenu();
    } else {
      this.closeMenu();
    }
  }
}
