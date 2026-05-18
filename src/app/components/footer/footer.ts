import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contactos, ContactoItem } from '../../services/contactos';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  private readonly contactosService = inject(Contactos);
  private readonly cdr = inject(ChangeDetectorRef);

  contactos: ContactoItem[] = [];

  ngOnInit(): void {
    this.contactosService.listar().subscribe(c => {
      this.contactos = c;
      this.cdr.markForCheck();
    });
  }

  iconType(icon: string): 'phone' | 'email' | 'location' | 'other' {
    if (icon.includes('phone')) return 'phone';
    if (icon.includes('envelope') || icon.includes('mail')) return 'email';
    if (icon.includes('location') || icon.includes('map') || icon.includes('marker')) return 'location';
    return 'other';
  }

  hrefFor(c: ContactoItem): string | null {
    const t = this.iconType(c.icon);
    if (t === 'phone') return `tel:+351${c.value.replace(/\s/g, '')}`;
    if (t === 'email') return `mailto:${c.value}`;
    return null;
  }
}
