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
import { SadComponent } from './pages/sad/sad.component';
import { ApoioEstudoComponent } from './pages/apoio-estudo/apoio-estudo.component';
import { NossaSenhoraBelemComponent } from './pages/nossa-senhora-belem/nossa-senhora-belem.component';
import { ParagemComponent } from './pages/paragem/paragem.component';


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
    { path: 'servicos/sad', component: SadComponent },
    { path: 'servicos/apoio-estudo', component: ApoioEstudoComponent },
    { path: 'servicos/nossa-senhora-belem', component: NossaSenhoraBelemComponent },
    { path: 'servicos/paragem', component: ParagemComponent },

    { path: '**', redirectTo: '' }
];