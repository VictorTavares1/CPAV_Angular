import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contactos as ContactosService, ContactoItem } from '../../services/contactos';

@Component({
  selector: 'app-contactos',
  imports: [CommonModule],
  templateUrl: './contactos.html',
  styleUrl: './contactos.css',
})
export class Contactos implements OnInit {
  private readonly contactosService = inject(ContactosService);
  private readonly cdr = inject(ChangeDetectorRef);

  contactos: ContactoItem[] = [];

  ngOnInit(): void {
    this.contactosService.listar().subscribe(c => {
      this.contactos = c;
      this.cdr.markForCheck();
    });
  }

  hrefFor(c: ContactoItem): string | null {
    const icon = c.icon.toLowerCase();
    if (icon.includes('phone')) return `tel:+351${c.value.replace(/\s/g, '')}`;
    if (icon.includes('envelope') || icon.includes('mail')) return `mailto:${c.value}`;
    return null;
  }
}
