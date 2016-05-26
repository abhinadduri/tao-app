/**
 * Created by abhinadduri on 5/25/16.
 */
import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'edge-help',
    template:`
    <div [ngStyle]="{'margin-top':'25px'}">
        <h4 [ngStyle]="{'text-align':'left'}">{{selectedSubComponent}}</h4>
        <br/>
        
        <div *ngIf="selectedSubComponent=='Creating an Edge'"
        [ngStyle]="{'text-align':'left'}">
            <p>To create an edge, hold down the 'Shift' key, then click 
            on the event you want to be the source, and then on the event <br />you want to be the target.
            For example, to make an edge from an event 'Event1' to an event 'Event2', hold down shift,<br />
            click on 'Event1', then click on 'Event2'.</p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Editing an Edge'"
        [ngStyle]="{'text-align':'left'}">
            <p>To edit an edge, click on it or on its respective arrowhead. This should open the Edge Editor panel on the 
                right side of your <br />screen. From here, you can edit the various attributes of your edge. In order to save a change,
                you must click the 'UPDATE' <br />button at the bottom of the panel.</p> 
            <h5>Edge Type</h5>
            <p>To change an edge from its default type of Scheduling to either a Pending or Cancelling edge, change its value<br /> 
            with the drop down menu provided.</p>
            <h5>Condition</h5>
            <p>The condition of an edge governs whether or not it does its respective action (schedules an event, a pending event<br />
            or cancels an event). The condition for an edge can involve 'globals' variables, 'params' variables, and 
            private variables <br />from the source event. The condition must evaluate to a boolean value.</p>
            <h5>Delay</h5>
            <p>An edge delay governs how many time units the Tao interpreter should wait to evaluate a target event after evaluating <br />
            a source event. The edge delay does not need to be an integer value.</p>
            <h5>Priority</h5>
            <p>The priority field assigns an event priority to the event that it schedules. If two events are scheduled to be executed <br />
            at the same time, the Tao interpreter runs the event with lower priority first. An edge priority does not need to be an integer 
            <br />value.</p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Pending Edges'"
        [ngStyle]="{'text-align':'left'}">
            <p>A pending edge differs from a scheduling edge in that it does not schedule its target event after a set delay.
            Instead, it waits <br />until a certain condition (specified in the condition field) is met, and then evaluates the target 
            event. The condition for a pending <br />edge can only involve global variables.</p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Cancelling Edges'"
        [ngStyle]="{'text-align':'left'}">
            <p>A cancelling edge prevents the occurence of exactly one instance of an event.</p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Parameters'"
        [ngStyle]="{'text-align':'left'}">
            <p>If an edge points to an event that has parameters specified, then the edge will have fields that specify the value of the <br />
            parameter being passed to that event. Those values can be global variables, private variables from the source event, or <br />
            even any parameters defined in the source event. All parameters are made visible to the target event through a 'params' <br />
            object. For example, an event 'Start' with a parameter 'queue' can access the parameter in its state change via 'params.queue'.<br />
            You cannot delete a parameter in the Edge Editor panel; deletions must be done by editing the corresponding target Event.</p>
        </div>
    </div>
            `,
    directives: [NgStyle]
})

export class EdgeHelp {
    @Input() selectedSubComponent: string;
}