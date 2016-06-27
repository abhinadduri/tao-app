/**
 * Created by abhinadduri on 5/25/16.
 */
import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'graph-help',
    template: `
        
        <div [ngStyle]="{'margin-top':'25px'}">
            <h4 [ngStyle]="{'text-align':'left'}">{{selectedSubComponent}}</h4>
            <br/>
            
            <div *ngIf="selectedSubComponent=='Tracing Output'"
            [ngStyle]="{'text-align':'left'}">
                <p>To graph a global variable, select the variable to graph in the Globals tab. Then, run a simulation. The
                graph output <br />for the latest simulation run can be viewed by clicking the graph button.</p>
            </div>
            
            
        </div>
    `,
    directives: [NgStyle]
})

export class GraphHelp {
    @Input() selectedSubComponent: string;
}