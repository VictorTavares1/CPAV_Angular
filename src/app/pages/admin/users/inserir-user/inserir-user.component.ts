import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../services/users.service';
import { UserRole } from '../../../../services/auth.service';
import { NotifyService } from '../../../../services/notify.service';
import { getPasswordIssues, PASSWORD_REQUIREMENTS } from '../../../../shared/password-policy';

@Component({
  selector: 'app-inserir-user',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inserir-user.component.html',
  styleUrl: './inserir-user.component.css',
})
export class InserirUserComponent {
  private readonly usersService = inject(UsersService);
  private readonly notify = inject(NotifyService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly passwordRequirements = PASSWORD_REQUIREMENTS;

  readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role:     ['admin', [Validators.required]],
  });

  isSubmitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.controls.password.value ?? '';
    const issues = getPasswordIssues(password);
    if (issues.length > 0) {
      this.notify.passwordWeak(issues);
      return;
    }

    this.isSubmitting = true;

    this.usersService.inserir({
      email:    this.form.controls.email.value ?? '',
      password,
      role:     (this.form.controls.role.value ?? 'admin') as UserRole,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Utilizador inserido com sucesso.');
        setTimeout(() => this.router.navigate(['/admin/utilizadores']), 600);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao inserir o utilizador.');
      },
    });
  }
}
