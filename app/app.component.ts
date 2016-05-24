/**
 * Created by abhinadduri on 5/14/16.
 */
import {ErgComponent} from './tao_erg/erg.component';
// import {SimulationList} from './tao_simulation_list/tao.simulation.list'
import {Component} from '@angular/core';
// import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';


@Component({
    selector: 'app',
    template: `
        <div class="main">
            <erg></erg>
        </div>
    `,
    directives: [ErgComponent]
})

// @RouteConfig([
//     {path: '/erg/:id', name: 'ERG', component: ErgComponent},
//     {path: '/list', name: 'SimulationList', component: SimulationList}
// ])

export class AppComponent { }