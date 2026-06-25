import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageContentsService, PageContentItem } from '../../../services/page-contents.service';
import { FacilitiesService, FacilityServiceWithFacility, ServiceKey } from '../../../services/facilities.service';
import { NotifyService } from '../../../services/notify.service';

interface EditState {
  [id: number]: { editing: boolean; value: string; saving: boolean };
}

interface FacilityEditState {
  [id: number]: {
    editing: boolean;
    name: string;
    address: string;
    tel: string;
    mobile: string;
    email: string;
    description: string;
    note: string;
    saving: boolean;
    showErrors: boolean;
  };
}

const SERVICE_PAGE_KEYS = new Set<ServiceKey>([
  'pre-escolar', 'catl', 'sad', 'paragem', 'apoio-estudo', 'nossa-senhora-belem',
]);

const RICH_TEXT_KEYS = new Set([
  'hero_description',
  'servicos_description',
  'quem_somos',
  'missao',
  'visao',
  'valores',
  'projeto_pedagogico',
  'atividades_principais',
  'inscricoes',
  'faq',
  'servicos_prestados',
  'metodologia',
  'admissao',
  'projeto_comunitario',
  'areas_atuacao',
  'como_participar',
  'parcerias',
  'servicos_atividades',
  'como_funciona',
  'como_solicitar',
  'objetivos',
  'donativos_lista',
  'irs_consignacao',
  'generos',
  'voluntariado',
]);

@Component({
  selector: 'app-page-contents-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page-contents-admin.component.html',
  styleUrl: './page-contents-admin.component.css',
})
export class PageContentsAdminComponent implements OnInit {
  private readonly pageContentsService = inject(PageContentsService);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly notify = inject(NotifyService);
  private readonly cdr = inject(ChangeDetectorRef);

  contents: PageContentItem[] = [];
  editState: EditState = {};
  isLoading = true;

  private _selectedPage = 'home';
  get selectedPage(): string { return this._selectedPage; }
  set selectedPage(page: string) {
    this._selectedPage = page;
    if (SERVICE_PAGE_KEYS.has(page as ServiceKey)) {
      this.loadFacilities(page as ServiceKey);
    } else {
      this.facilities = [];
      this.facilityEditState = {};
    }
  }

  facilities: FacilityServiceWithFacility[] = [];
  facilityEditState: FacilityEditState = {};

  isServicePage(page: string): boolean {
    return SERVICE_PAGE_KEYS.has(page as ServiceKey);
  }

  loadFacilities(page: ServiceKey): void {
    this.facilitiesService.listarPorServico(page).subscribe(rows => {
      this.facilities = rows;
      this.facilityEditState = {};
      rows.forEach(f => {
        this.facilityEditState[f.id] = {
          editing:     false,
          name:        f.name,
          address:     f.address  ?? '',
          tel:         f.tel      ?? '',
          mobile:      f.mobile   ?? '',
          email:       f.email    ?? '',
          description: f.description ?? '',
          note:        f.note        ?? '',
          saving:      false,
          showErrors:  false,
        };
      });
      this.cdr.markForCheck();
    });
  }

  startEditFacility(f: FacilityServiceWithFacility): void {
    this.facilityEditState[f.id].editing = true;
    this.cdr.markForCheck();
  }

  cancelEditFacility(f: FacilityServiceWithFacility): void {
    const s = this.facilityEditState[f.id];
    s.editing     = false;
    s.showErrors  = false;
    s.name        = f.name;
    s.address     = f.address     ?? '';
    s.tel         = f.tel         ?? '';
    s.mobile      = f.mobile      ?? '';
    s.email       = f.email       ?? '';
    s.description = f.description ?? '';
    s.note        = f.note        ?? '';
    this.cdr.markForCheck();
  }

  private readonly PHONE_RE  = /^\d{1,9}$/;
  private readonly EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  facilityFieldError(id: number, field: 'name' | 'tel' | 'mobile' | 'email'): string {
    const s = this.facilityEditState[id];
    if (!s?.showErrors) return '';
    if (field === 'name'   && !s.name.trim())                           return 'O nome é obrigatório.';
    if (field === 'tel'    && s.tel.trim()    && !this.PHONE_RE.test(s.tel.trim()))    return 'Só dígitos, máx. 9 caracteres.';
    if (field === 'mobile' && s.mobile.trim() && !this.PHONE_RE.test(s.mobile.trim())) return 'Só dígitos, máx. 9 caracteres.';
    if (field === 'email'  && s.email.trim()  && !this.EMAIL_RE.test(s.email.trim()))  return 'Email inválido.';
    return '';
  }

  private isFacilityValid(id: number): boolean {
    const s = this.facilityEditState[id];
    if (!s.name.trim()) return false;
    if (s.tel.trim()    && !this.PHONE_RE.test(s.tel.trim()))    return false;
    if (s.mobile.trim() && !this.PHONE_RE.test(s.mobile.trim())) return false;
    if (s.email.trim()  && !this.EMAIL_RE.test(s.email.trim()))  return false;
    return true;
  }

  saveFacility(f: FacilityServiceWithFacility): void {
    const state = this.facilityEditState[f.id];
    state.showErrors = true;
    this.cdr.markForCheck();
    if (!this.isFacilityValid(f.id)) return;
    state.saving = true;

    const descTrimmed = state.description.trim() || null;
    const noteTrimmed = state.note.trim() || null;
    const addrTrimmed = state.address.trim() || null;
    const telTrimmed  = state.tel.trim()     || null;
    const mobTrimmed  = state.mobile.trim()  || null;
    const emailTrimmed = state.email.trim()  || null;
    const nameTrimmed  = state.name.trim();

    const save$ = [
      this.facilitiesService.editarServico({ ...f, description: descTrimmed, note: noteTrimmed }),
      this.facilitiesService.editarContactos({ id: f.id_facility, name: nameTrimmed, address: addrTrimmed, tel: telTrimmed, mobile: mobTrimmed, email: emailTrimmed }),
    ];

    let done = 0;
    let failed = false;
    const onDone = () => {
      done++;
      if (done < 2) return;
      state.saving = false;
      if (!failed) {
        f.name        = nameTrimmed;
        f.address     = addrTrimmed;
        f.tel         = telTrimmed;
        f.mobile      = mobTrimmed;
        f.email       = emailTrimmed;
        f.description = descTrimmed;
        f.note        = noteTrimmed;
        state.editing = false;
        this.notify.success('Equipamento atualizado.');
      }
      this.cdr.markForCheck();
    };

    save$.forEach(obs => obs.subscribe({
      next: () => onDone(),
      error: (err) => {
        failed = true;
        this.notify.error(err?.error?.message ?? 'Erro ao guardar.');
        onDone();
      },
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly quillInstances: Record<number, any> = {};

  private readonly PAGE_ORDER = [
    'home', 'sobre-nos',
    'pre-escolar', 'catl', 'sad', 'paragem',
    'nossa-senhora-belem', 'apoio-estudo', 'po-apmc',
    'como-ajudar',
  ];

  get pages(): string[] {
    const all = [...new Set(this.contents.map(c => c.Page_name))];
    return all.sort((a, b) => {
      const ia = this.PAGE_ORDER.indexOf(a);
      const ib = this.PAGE_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }

  get pagesGerais(): string[] {
    return this.pages.filter(p => ['home', 'sobre-nos'].includes(p));
  }

  get pagesServicos(): string[] {
    return this.pages.filter(p => !['home', 'sobre-nos', 'como-ajudar'].includes(p));
  }

  get pagesOutras(): string[] {
    return this.pages.filter(p => ['como-ajudar'].includes(p));
  }

  contentsByPage(page: string): PageContentItem[] {
    return this.contents.filter(c => c.Page_name === page);
  }

  hintFor(key: string): string {
    const hints: Record<string, string> = {
      hero_title: 'Título principal visível na página inicial.',
      hero_description: 'Texto de introdução abaixo do título.',
      servicos_description: 'Parágrafo de descrição na secção de serviços.',
      quem_somos: 'Texto da secção "Quem Somos" na página Sobre Nós.',
      missao: 'Texto da Missão.',
      visao: 'Texto da Visão.',
      valores: 'Texto dos Valores.',
      descricao_geral: 'Parágrafo de apresentação no topo da página do serviço.',
    };
    return hints[key] ?? '';
  }

  isRichText(key: string): boolean {
    return RICH_TEXT_KEYS.has(key);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.pageContentsService.listar().subscribe(rows => {
      // A página "contactos" tem o seu próprio editor em /admin/contactos,
      // por isso esconde-se aqui para evitar editar a mesma coisa em dois sítios.
      this.contents = rows.filter(r => r.Page_name !== 'contactos');
      this.editState = {};
      this.contents.forEach(r => {
        this.editState[r.id] = { editing: false, value: r.content_value, saving: false };
      });
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  async startEdit(item: PageContentItem): Promise<void> {
    this.editState[item.id].editing = true;
    this.cdr.detectChanges();

    if (this.isRichText(item.section_key)) {
      await this.initQuill(item);
    }
  }

  cancelEdit(item: PageContentItem): void {
    this.editState[item.id].editing = false;
    this.editState[item.id].value = item.content_value;
    delete this.quillInstances[item.id];
  }

  save(item: PageContentItem): void {
    const state = this.editState[item.id];
    state.saving = true;

    this.pageContentsService.editar(item.id, state.value).subscribe({
      next: () => {
        item.content_value = state.value;
        state.editing = false;
        state.saving = false;
        delete this.quillInstances[item.id];
        this.cdr.markForCheck();
        this.notify.success('Conteúdo atualizado com sucesso.');
      },
      error: (err) => {
        state.saving = false;
        this.cdr.markForCheck();
        this.notify.error(err?.error?.message ?? 'Erro ao atualizar.');
      },
    });
  }

  private async initQuill(item: PageContentItem): Promise<void> {
    if (this.quillInstances[item.id]) return;

    // Wait for Angular to render the editor container before querying the DOM
    await new Promise(resolve => setTimeout(resolve, 0));

    const container = document.getElementById('quill-editor-' + item.id);
    if (!container) return;

    const { default: Quill } = await import('quill');
    const quill = new Quill(container, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [1, 2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
    });

    // Pré-popula com o valor atual.
    const initialValue = this.editState[item.id].value;
    if (initialValue) {
      quill.clipboard.dangerouslyPasteHTML(initialValue);
    }

    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      const isEmpty = html === '' || html === '<p><br></p>';
      this.editState[item.id].value = isEmpty ? '' : html;
    });

    this.quillInstances[item.id] = quill;
  }

  labelFor(key: string): string {
    const labels: Record<string, string> = {
      hero_title: 'Título',
      hero_description: 'Descrição',
      servicos_description: 'Descrição Serviços',
      quem_somos: 'Quem Somos',
      missao: 'Missão',
      visao: 'Visão',
      valores: 'Valores',
      descricao_geral: 'Descrição Geral',
      publico_alvo: 'Público-Alvo',
      horario: 'Horário',
      componentes: 'Componentes',
      equipa: 'Equipa',
      objetivos: 'Objetivos',
      projeto_pedagogico: 'Projeto Pedagógico',
      atividades_principais: 'Atividades Principais',
      inscricoes: 'Inscrições',
      faq: 'Perguntas Frequentes',
      area_intervencao: 'Área de Intervenção',
      servicos_prestados: 'Serviços Prestados',
      metodologia: 'Metodologia',
      admissao: 'Processo de Admissão',
      atividades: 'Atividades',
      projeto_comunitario: 'Projeto Comunitário',
      areas_atuacao: 'Áreas de Atuação',
      como_participar: 'Como Participar',
      parcerias: 'Parcerias',
      servicos_disponiveis: 'Serviços Disponíveis',
      servicos_atividades: 'Serviços e Atividades',
      disciplinas: 'Disciplinas',
      o_que_e_paragrafo: 'O Que É (parágrafo)',
      como_funciona: 'Como Funciona',
      como_solicitar: 'Como Solicitar',
      intro_titulo: 'Título Principal',
      donativos_lista: 'Lista — O que fazemos com o donativo',
      irs_consignacao: 'Consignação de IRS',
      generos: 'Donativos em Géneros',
      voluntariado: 'Voluntariado',
    };
    return labels[key] ?? key;
  }

  pageLabel(page: string): string {
    const labels: Record<string, string> = {
      home: 'Página Inicial',
      'sobre-nos': 'Sobre Nós',
      'pre-escolar': 'Pré-Escolar',
      catl: 'C.A.T.L.',
      sad: 'S.A.D. - Apoio Domiciliário',
      paragem: 'Centro Comunitário P.A.R.A.G.E.M.',
      'nossa-senhora-belem': 'Centro Social Nossa Senhora de Belém',
      'apoio-estudo': 'Apoio ao Estudo',
      'po-apmc': 'PO APMC',
      'como-ajudar': 'Como Ajudar',
    };
    return labels[page] ?? page;
  }
}
