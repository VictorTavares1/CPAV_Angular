import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2, inject } from '@angular/core';

/**
 * Anima qualquer elemento com fade + slide quando entra na viewport.
 *
 * Uso simples:
 *   <div appScrollReveal>...</div>
 *
 * Com delay (útil para staggered animations dentro de @for, baseado no índice):
 *   <div [appScrollReveal]="i * 80">...</div>
 *
 * Direção:
 *   <div appScrollReveal revealDirection="left">...</div>
 *
 * O elemento começa invisível e deslocado; ao entrar em vista
 * recebe a classe `reveal--visible` que o devolve à posição final.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  /** Atraso da animação em milisegundos (útil para efeito escalonado). */
  @Input() appScrollReveal: number | string = 0;
  /** Direção da entrada. */
  @Input() revealDirection: 'up' | 'down' | 'left' | 'right' = 'up';
  /** Quanto do elemento precisa estar visível para disparar (0 a 1). */
  @Input() revealThreshold = 0.15;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const element = this.el.nativeElement as HTMLElement;

    // Sem IntersectionObserver (SSR ou browser antigo) mostra logo
    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(element, 'reveal');
      this.renderer.addClass(element, 'reveal--visible');
      return;
    }

    this.renderer.addClass(element, 'reveal');
    this.renderer.addClass(element, `reveal--${this.revealDirection}`);

    const delay = Number(this.appScrollReveal) || 0;
    if (delay > 0) {
      this.renderer.setStyle(element, 'transition-delay', `${delay}ms`);
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(element, 'reveal--visible');
            this.observer?.unobserve(element);
          }
        }
      },
      {
        threshold: this.revealThreshold,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
