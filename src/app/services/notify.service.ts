import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Notificações centralizadas do painel de administração.
 * Sucesso: toast no canto superior direito, fecha sozinho.
 * Erro / aviso: modal que exige confirmação.
 * Confirmação: modal sim/cancelar que devolve uma Promise<boolean>.
 */
@Injectable({ providedIn: 'root' })
export class NotifyService {
  success(message: string, title = 'Sucesso'): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title,
      text: message,
      showConfirmButton: false,
      timer: 2400,
      timerProgressBar: true,
    });
  }

  error(message: string, title = 'Erro'): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2c5aa0',
    });
  }

  warning(message: string, title = 'Atenção'): void {
    Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2c5aa0',
    });
  }

  info(message: string, title = 'Informação'): void {
    Swal.fire({
      icon: 'info',
      title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2c5aa0',
    });
  }

  /**
   * Modal específico para passwords fracas. Recebe a lista de requisitos
   * em falta e renderiza-os numa lista no SweetAlert.
   */
  passwordWeak(issues: string[]): void {
    const list = issues
      .map((i) => `<li style="margin:4px 0">${i}</li>`)
      .join('');
    Swal.fire({
      icon: 'warning',
      title: 'Password fraca',
      html:
        '<p style="margin:0 0 10px">A password deve cumprir:</p>' +
        '<ul style="text-align:left;display:inline-block;padding-left:20px;margin:0">' +
        list +
        '</ul>',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2c5aa0',
    });
  }

  async confirm(
    message: string,
    title = 'Tem a certeza?',
    confirmText = 'Sim',
    cancelText = 'Cancelar'
  ): Promise<boolean> {
    const res = await Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#2c5aa0',
      cancelButtonColor: '#9ca3af',
      reverseButtons: true,
    });
    return res.isConfirmed;
  }
}
