
import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app';
import {appRouterProviders} from './routes';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';
import {EdgeService} from './tao_edge/tao.edge.service';
import {currentERG} from './tao_cloud/tao.erg.service';
import {currentUser} from './tao_cloud/tao.user.service';

bootstrap(AppComponent,
    [EdgeService,
     currentERG,
     currentUser,
     appRouterProviders,
     HTTP_PROVIDERS,
     {provide: LocationStrategy, useClass: HashLocationStrategy}])
    .catch(err => console.error(err));
