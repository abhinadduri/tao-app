/**
 * Created by abhinadduri on 5/14/16.
 */
import {ErgComponent} from './tao_erg/erg.component';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
// import './rxjs-operators';


@Component({
    selector: 'app',
    template: `
        <div class="main">
            <div>
              <router-outlet></router-outlet>
            </div>
        </div>
    `,
    directives: [ErgComponent, ROUTER_DIRECTIVES]
})


export class AppComponent { }