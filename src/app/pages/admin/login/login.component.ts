import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotifyService);
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

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isSubmitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.controls.email.value ?? '';
    const password = this.form.controls.password.value ?? '';

    this.isSubmitting = true;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notify.error(error?.error?.message ?? 'Não foi possível iniciar sessão.');
      },
    });
  }
}
