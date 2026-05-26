import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';
import { getPasswordIssues, PASSWORD_REQUIREMENTS } from '../../../shared/password-policy';

@Component({
  selector: 'app-conta',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.css',
})
export class ContaComponent {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);

  readonly passwordRequirements = PASSWORD_REQUIREMENTS;

  readonly form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword:     ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  isSubmitting = false;

  get currentUser() {
    return this.authService.currentUser;
  }

  get passwordsMatch(): boolean {
    return this.form.controls.newPassword.value === this.form.controls.confirmPassword.value;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch) {
      this.notify.warning('As passwords novas não coincidem.');
      return;
    }

    const newPassword = this.form.controls.newPassword.value ?? '';
    const issues = getPasswordIssues(newPassword);
    if (issues.length > 0) {
      this.notify.passwordWeak(issues);
      return;
    }

    this.isSubmitting = true;

    this.usersService.mudarPasswordPropria(
      this.form.controls.currentPassword.value ?? '',
      newPassword,
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        this.notify.success('Password alterada com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao alterar a password.');
      },
    });
  }
}
