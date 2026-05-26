import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../services/users.service';
import { AuthService, UserRole } from '../../../../services/auth.service';
import { NotifyService } from '../../../../services/notify.service';
import { getPasswordIssues, PASSWORD_REQUIREMENTS } from '../../../../shared/password-policy';

@Component({
  selector: 'app-editar-user',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.css',
})
export class EditarUserComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotifyService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role:  ['admin', [Validators.required]],
  });

  readonly passwordForm = this.fb.group({
    password: ['', [Validators.required]],
  });

  readonly passwordRequirements = PASSWORD_REQUIREMENTS;

  userId = 0;
  isLoading = true;
  isSubmitting = false;
  isSavingPassword = false;

  get isMe(): boolean {
    return this.authService.currentUser?.idUser === this.userId;
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.usersService.lerPorId(this.userId).subscribe({
      next: (u) => {
        this.form.patchValue({ email: u.email, role: u.role });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => this.router.navigate(['/admin/utilizadores']),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.usersService.editar({
      id:    this.userId,
      email: this.form.controls.email.value ?? '',
      role:  (this.form.controls.role.value ?? 'admin') as UserRole,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notify.success('Utilizador atualizado com sucesso.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar.');
      },
    });
  }

  async submitPassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const novaPassword = this.passwordForm.controls.password.value ?? '';
    const issues = getPasswordIssues(novaPassword);
    if (issues.length > 0) {
      this.notify.passwordWeak(issues);
      return;
    }

    const ok = await this.notify.confirm(
      `Pretende alterar a password deste utilizador? A password antiga deixará de funcionar.`
    );
    if (!ok) return;

    this.isSavingPassword = true;

    this.usersService.mudarPassword(this.userId, novaPassword).subscribe({
      next: () => {
        this.isSavingPassword = false;
        this.passwordForm.reset();
        this.notify.success('Password alterada com sucesso.');
      },
      error: (err) => {
        this.isSavingPassword = false;
        this.notify.error(err?.error?.message ?? 'Erro ao alterar a password.');
      },
    });
  }
}
