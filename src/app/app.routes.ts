import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SobreNos } from './pages/sobre-nos/sobre-nos';
import { Servicos } from './pages/servicos/servicos';
import { Noticias } from './pages/noticias/noticias';
import { Eventos } from './pages/eventos/eventos';
import { Contactos } from './pages/contactos/contactos';
import { ComoAjudar } from './pages/como-ajudar/como-ajudar';
import { Relatorios } from './pages/relatorios/relatorios';
import { PreEscolarComponent } from './pages/pre-escolar/pre-escolar.component';
import { CatlComponent } from './pages/catl/catl.component';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'sobre-nos', component: SobreNos },
    { path: 'servicos', component: Servicos },
    { path: 'noticias', component: Noticias },
    { path: 'eventos', component: Eventos },
    { path: 'contactos', component: Contactos },
    { path: 'como-ajudar', component: ComoAjudar },
    { path: 'relatorios', component: Relatorios },
    { path: 'servicos/pre-escolar', component: PreEscolarComponent },
    { path: 'servicos/catl', component: CatlComponent },

    { path: '**', redirectTo: '' }
];