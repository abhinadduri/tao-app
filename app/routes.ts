/**
 * Created by abhinadduri on 7/27/16.
 */

import {provideRouter, RouterConfig} from '@angular/router';
import {ErgComponent} from './tao_erg/erg.component';
import {HomepageComponent} from './tao_homepage/tao.homepage';

const routes: RouterConfig = [
    {path: '', component: HomepageComponent},
    {path: 'erg/:id', component: ErgComponent}
];

export const appRouterProviders = [
  provideRouter(routes)
];