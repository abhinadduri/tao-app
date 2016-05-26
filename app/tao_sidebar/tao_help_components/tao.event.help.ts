/**
 * Created by abhinadduri on 5/25/16.
 */
import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'event-help',
    template: `
        
        <div [ngStyle]="{'margin-top':'25px'}">
            <h4 [ngStyle]="{'text-align':'left'}">{{selectedSubComponent}}</h4>
            <br/>
            
            <div *ngIf="selectedSubComponent=='Creating an Event'"
            [ngStyle]="{'text-align':'left'}">
                <p>In order to make an event, double click the anywhere on the screen. An 
                event will be created at your cursor's position.</p>
            </div>
            
            <div *ngIf="selectedSubComponent=='Editing an Event'"
            [ngStyle]="{'text-align':'left'}">
                <p>To edit an event, click on it. This should open the Event Editor panel on the 
                right side of your screen. From here, you can edit <br />the various attributes of your event. In order to save a change,
                you must click the 'UPDATE' button at the bottom of the panel.</p>
                <h5>Name</h5>
                <p>The name property affects the name with which the event is displayed on the screen.</p>
                <h5>Trace</h5>
                <p>The trace property determines whether or not the evaluation of an event is logged in the Javascript console.
                Checking this <br />means you will be informed when an event occurs, along with that event's unique ID.</p>
                <h5>State Change</h5>
                <p>The state change contains Javascript code that will be evaluated when that event is evaluated. The code is always
                evaluated, <br />but only run if and only if that event has been scheduled. An exception is the Run event, whose
                state change is always run to <br />initiate a simulation.</p>
                <h5>Parameters</h5>
                <p>Each event has a list of parameters. To add a parameter, type the desired name into the input box and press enter.
                Parameters are <br />variables that can retain information from previous event evaluations. Each event parameter's value
                is injected when that event <br />is scheduled. To delete a parameter, press the 'x' button next to that parameter.</p>
            </div>
            
            <div *ngIf="selectedSubComponent=='Private Variables'"
            [ngStyle]="{'text-align':'left'}">
                <p>Tao allows for private variables -- variables that are only visible during a particular event's evaluation.
                To use a private <br />variable, just initialize a variable with proper Javascript syntax within an event's state
                change, i.e. 'var tao = 5;'.</p>
            </div>
        </div>
    `,
    directives: [NgStyle]
})

export class EventHelp {
    @Input() selectedSubComponent: string;
}