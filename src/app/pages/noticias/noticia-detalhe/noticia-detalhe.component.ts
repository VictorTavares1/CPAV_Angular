import { Component, computed, inject, OnDestroy, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';
import { Noticias, NoticiaItem } from '../../../services/noticias';
import { ApiConfigService } from '../../../services/api-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticia-detalhe',
  imports: [RouterLink, CommonModule],
  templateUrl: './noticia-detalhe.component.html',
  styleUrl: './noticia-detalhe.component.css',
})
export class NoticiaDetalheComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly noticiasService = inject(Noticias);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly uploadsUrl = inject(ApiConfigService).uploadsUrl;
  private viewerInstance: any = null;

  private readonly noticia$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      if (!id) return of(null);
      return this.noticiasService.getById(id).pipe(catchError(() => of(null)));
    })
  );

  readonly noticia = toSignal(this.noticia$);
  readonly loading = computed(() => this.noticia() === undefined);
  readonly notFound = computed(() => !this.loading() && this.noticia() === null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const n = this.noticia();
        if (n?.images?.length) {
          Promise.resolve().then(() => this.initViewer());
        }
      });
    }
  }

  private async initViewer() {
    const galeria = document.getElementById('galeria');
    if (!galeria) return;

    const { default: Viewer } = await import('viewerjs');

    this.viewerInstance?.destroy();
    this.viewerInstance = new Viewer(galeria, {
      url: 'data-original',
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 1,
        play: 1,
        next: 1,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
  }

  ngOnDestroy() {
    this.viewerInstance?.destroy();
    this.viewerInstance = null;
  }

  fmtDate(dateHour: string | undefined): string {
    if (!dateHour) return '';
    const d = new Date(dateHour);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-PT', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
