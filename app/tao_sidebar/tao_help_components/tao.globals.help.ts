/**
 * Created by abhinadduri on 5/26/16.
 */
import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'globals-help',
    template: `
        <div [ngStyle]="{'margin-top':'25px'}">
            <h4 [ngStyle]="{'text-align':'left'}">{{selectedSubComponent}}</h4>
            <br/>
            
            <div *ngIf="selectedSubComponent=='Creating Global Variables'"
            [ngStyle]="{'text-align':'left'}">
                <p>To create a global variable, click on the 'Globals' tab on the panel at the right of your screen.
                Go to the input under <br />the Global Variables label, type in the name of the variable, and press enter.
                You can then edit the initial value and the <br />description of that variable (this saves automatically).
                To delete a global variable, press the 'x' button next to the corresponding<br />variable.</p>
            </div>
            
            <div *ngIf="selectedSubComponent=='Accessing Global Variables'"
            [ngStyle]="{'text-align':'left'}">
                <p>You can access a global variable anywhere in your simulation. This means you can use them in your edge
                conditions <br />and in your event state changes. Each global variable is shared by every event and edge. To access a 
                global variable <br />named sum, you would use the 'globals' object, i.e. 'globals.sum = globals.sum + 1;'.</p>
            </div>
            
            <div *ngIf="selectedSubComponent=='Time Units'"
            [ngStyle]="{'text-align':'left'}">
                <p>Each Tao simulation is run for a certain number of time units. Any event that is scheduled to take place after <br />
                the specified time bound will not take place. A simulation will also terminate if there are no events or pending events <br />
                scheduled. If there are no normal events scheduled, the simulation will step by one time step until it reaches the <br />
                specified duration and then terminate.
                </p>
            </div>
            
            <div *ngIf="selectedSubComponent=='Console Output'"
            [ngStyle]="{'text-align':'left'}">
                <p>After a Tao simulation is run, there will be a trace output available in the browser console. To access the console, press <br />
                command + shift + j on a mac, or ctrl + shift + j on a pc. 
                </p>
            </div>
        </div>
    `,
    directives: [NgStyle]
})

export class GlobalsHelp {
    @Input() selectedSubComponent: string;
}