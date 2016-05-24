import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {EdgeService} from './tao_edge/tao.edge.service'


bootstrap(AppComponent, [EdgeService]);
