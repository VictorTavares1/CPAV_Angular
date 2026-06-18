import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, afterNextRender, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';

declare const grecaptcha: any;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  @ViewChild('recaptchaEl', { static: false }) recaptchaEl?: ElementRef<HTMLDivElement>;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotifyService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly recaptchaSiteKey = '6LcsPwctAAAAAE0tu30BpwPNMffGsnQNd2WiwHrZ';
  private recaptchaWidgetId: number | null = null;

  // Em desenvolvimento (ng serve) o reCAPTCHA é desativado para facilitar testes.
  readonly captchaEnabled = environment.production;

  constructor() {
    this.doc.body.style.paddingTop = '0';
    this.doc.body.style.backgroundColor = '#0d64c1';

    if (this.captchaEnabled) {
      afterNextRender(() => this.renderRecaptcha());
    }
  }

  private renderRecaptcha(retries = 30): void {
    if (typeof grecaptcha === 'undefined' || !grecaptcha.render) {
      if (retries > 0) {
        setTimeout(() => this.renderRecaptcha(retries - 1), 100);
      }
      return;
    }
    if (!this.recaptchaEl) return;
    if (this.recaptchaWidgetId !== null) return;

    try {
      this.recaptchaWidgetId = grecaptcha.render(this.recaptchaEl.nativeElement, {
        sitekey: this.recaptchaSiteKey,
      });
    } catch {
      // Se a div já tiver sido renderizada por auto-render, ignora.
    }
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

    let captchaToken = 'dev-bypass';

    if (this.captchaEnabled) {
      captchaToken = '';
      try {
        captchaToken = this.recaptchaWidgetId !== null
          ? grecaptcha.getResponse(this.recaptchaWidgetId)
          : grecaptcha.getResponse();
      } catch {
        captchaToken = '';
      }

      if (!captchaToken) {
        this.notify.warning('Por favor, confirma que não és um robô antes de entrar.');
        return;
      }
    }

    const email = this.form.controls.email.value ?? '';
    const password = this.form.controls.password.value ?? '';

    this.isSubmitting = true;

    this.authService.login(email, password, captchaToken).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
        if (this.captchaEnabled) {
          try {
            if (this.recaptchaWidgetId !== null) {
              grecaptcha.reset(this.recaptchaWidgetId);
            } else {
              grecaptcha.reset();
            }
          } catch { /* ignore */ }
        }
        this.notify.error(error?.error?.message ?? 'Não foi possível iniciar sessão.');
      },
    });
  }
}
