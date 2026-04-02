import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SobreNos } from './pages/sobre-nos/sobre-nos';
import { Servicos } from './pages/servicos/servicos';
import { Noticias } from './pages/noticias/noticias';
import { Eventos } from './pages/eventos/eventos';
import { Contactos } from './pages/contactos/contactos';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'sobre-nos', component: SobreNos },
    { path: 'servicos', component: Servicos },
    { path: 'noticias', component: Noticias },
    { path: 'eventos', component: Eventos },
    { path: 'contactos', component: Contactos },
    { path: '**', redirectTo: '' }
];