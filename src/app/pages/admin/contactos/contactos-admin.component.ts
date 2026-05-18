import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Contactos, ContactoItemAdmin } from '../../../services/contactos';

@Component({
  selector: 'app-contactos-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contactos-admin.component.html',
  styleUrl: './contactos-admin.component.css',
})
export class ContactosAdminComponent implements OnInit {
  private readonly contactosService = inject(Contactos);
  private readonly cdr = inject(ChangeDetectorRef);

  contactos: ContactoItemAdmin[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  searchQuery = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.contactosService.listarAdmin().subscribe(rows => {
      this.contactos = rows;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  get filtered(): ContactoItemAdmin[] {
    return this.contactos.filter(c => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || c.type.toLowerCase().includes(q) || c.value.toLowerCase().includes(q);
      const matchStatus = !this.selectedStatus ||
        (this.selectedStatus === '1' && c.idState === 1) ||
        (this.selectedStatus === '2' && c.idState !== 1);
      return matchSearch && matchStatus;
    });
  }

  toggle(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.contactosService.toggle(id).subscribe({
      next: () => {
        this.successMessage = 'Estado do contacto alterado.';
        this.load();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Erro ao alterar estado.';
      },
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
  }
}
