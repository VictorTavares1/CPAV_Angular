import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { superAdminGuard } from './guards/super-admin.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { Home } from './pages/home/home';
import { SobreNos } from './pages/sobre-nos/sobre-nos';
import { Servicos } from './pages/servicos/servicos';
import { Noticias } from './pages/noticias/noticias';
import { NoticiaDetalheComponent } from './pages/noticias/noticia-detalhe/noticia-detalhe.component';
import { Eventos } from './pages/eventos/eventos';
import { Contactos } from './pages/contactos/contactos';
import { ComoAjudar } from './pages/como-ajudar/como-ajudar';
import { Relatorios } from './pages/relatorios/relatorios';
import { PreEscolarComponent } from './pages/pre-escolar/pre-escolar.component';
import { CatlComponent } from './pages/catl/catl.component';
import { SadComponent } from './pages/sad/sad.component';
import { ApoioEstudoComponent } from './pages/apoio-estudo/apoio-estudo.component';
import { NossaSenhoraBelemComponent } from './pages/nossa-senhora-belem/nossa-senhora-belem.component';
import { ParagemComponent } from './pages/paragem/paragem.component';
import { PoApmcComponent } from './pages/po-apmc/po-apmc.component';


export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: Home },
            { path: 'sobre-nos', component: SobreNos },
            { path: 'servicos', component: Servicos },
            { path: 'noticias', component: Noticias },
            { path: 'noticias/:id', component: NoticiaDetalheComponent },
            { path: 'eventos', component: Eventos },
            { path: 'contactos', component: Contactos },
            { path: 'como-ajudar', component: ComoAjudar },
            { path: 'relatorios', component: Relatorios },
            { path: 'servicos/pre-escolar', component: PreEscolarComponent },
            { path: 'servicos/catl', component: CatlComponent },
            { path: 'servicos/sad', component: SadComponent },
            { path: 'servicos/apoio-estudo', component: ApoioEstudoComponent },
            { path: 'servicos/nossa-senhora-belem', component: NossaSenhoraBelemComponent },
            { path: 'servicos/paragem', component: ParagemComponent },
            { path: 'servicos/po-apmc', component: PoApmcComponent },
        ]
    },
    {
        path: 'admin/login',
        loadComponent: () =>
            import('./pages/admin/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            {
                path: 'noticias',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/noticias/noticias-admin.component').then((m) => m.NoticiasAdminComponent),
            },
            {
                path: 'noticias/inserir',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/noticias/inserir-noticia/inserir-noticia.component').then((m) => m.InserirNoticiaComponent),
            },
            {
                path: 'relatorios',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/relatorios/relatorios-admin.component').then((m) => m.RelatoriosAdminComponent),
            },
            {
                path: 'relatorios/inserir',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/relatorios/inserir-relatorio/inserir-relatorio.component').then((m) => m.InserirRelatorioComponent),
            },
            {
                path: 'eventos',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/eventos/eventos-admin.component').then((m) => m.EventosAdminComponent),
            },
            {
                path: 'eventos/inserir',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/eventos/inserir-evento/inserir-evento.component').then((m) => m.InserirEventoComponent),
            },
            {
                path: 'eventos/editar/:id',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/eventos/editar-evento/editar-evento.component').then((m) => m.EditarEventoComponent),
            },
            {
                path: 'contactos',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/contactos/contactos-admin.component').then((m) => m.ContactosAdminComponent),
            },
            {
                path: 'contactos/inserir',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/contactos/inserir-contacto/inserir-contacto.component').then((m) => m.InserirContactoComponent),
            },
            {
                path: 'contactos/editar/:id',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/contactos/editar-contacto/editar-contacto.component').then((m) => m.EditarContactoComponent),
            },
            {
                path: 'contactos/facility/inserir',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/contactos/facilities/inserir-facility/inserir-facility.component').then((m) => m.InserirFacilityComponent),
            },
            {
                path: 'contactos/facility/editar/:id',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/contactos/facilities/editar-facility/editar-facility.component').then((m) => m.EditarFacilityComponent),
            },
            {
                path: 'servicos',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/servicos/servicos-admin.component').then((m) => m.ServicosAdminComponent),
            },
            {
                path: 'servicos/inserir',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/servicos/inserir-servico/inserir-servico.component').then((m) => m.InserirServicoComponent),
            },
            {
                path: 'servicos/editar/:id',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/servicos/editar-servico/editar-servico.component').then((m) => m.EditarServicoComponent),
            },
            {
                path: 'page-contents',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/page-contents/page-contents-admin.component').then((m) => m.PageContentsAdminComponent),
            },
            {
                path: 'logs',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/logs/logs-admin.component').then((m) => m.LogsAdminComponent),
            },
            {
                path: 'utilizadores',
                canActivate: [superAdminGuard],
                loadComponent: () =>
                    import('./pages/admin/users/users-admin.component').then((m) => m.UsersAdminComponent),
            },
            {
                path: 'utilizadores/inserir',
                canActivate: [superAdminGuard],
                loadComponent: () =>
                    import('./pages/admin/users/inserir-user/inserir-user.component').then((m) => m.InserirUserComponent),
            },
            {
                path: 'utilizadores/editar/:id',
                canActivate: [superAdminGuard],
                loadComponent: () =>
                    import('./pages/admin/users/editar-user/editar-user.component').then((m) => m.EditarUserComponent),
            },
            {
                path: 'conta',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./pages/admin/conta/conta.component').then((m) => m.ContaComponent),
            },
            { path: '', pathMatch: 'full', redirectTo: '/admin/login' },
        ]
    },
    { path: '**', redirectTo: '' }
];