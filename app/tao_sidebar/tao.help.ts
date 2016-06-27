/**
 * Created by abhinadduri on 5/24/16.
 */
import {Component, ViewChild, OnInit} from '@angular/core';
import {NgStyle} from '@angular/common';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {EventHelp} from './tao_help_components/tao.event.help';
import {EdgeHelp} from './tao_help_components/tao.edge.help';
import {GlobalsHelp} from './tao_help_components/tao.globals.help';
import {JavascriptHelp} from './tao_help_components/tao.javascript.help';
import {GraphHelp} from './tao_help_components/tao.graph.help';

@Component({
    selector: 'help',
    template: `
    <modal #modal
        [ngStyle]="{'height': '800px'}">
        <modal-header [show-close]="true">
            <h4 class="modal-title" style="text-align: center;">Help</h4>
        </modal-header>
        <modal-body>
            <div>
                <div 
                [ngStyle]="{
                'width': '20%',
                'border-right': 'solid 1px black',
                'display': 'inline-block'}">
                    <div
                    [ngStyle]="{'text-align':'center'}"><h4>Contents</h4><br/></div>
                    <ul [ngStyle]="{'list-style-type':'none'}">
                        <li *ngFor="let helpNavElement of helpListKeys">
                        {{helpNavElement}}
                            <ul>
                                <li *ngFor="let helpSubElement of helpListSubkeys[helpNavElement]"
                                (click)="selectHelpElement(helpSubElement)"
                                [ngStyle]="{'cursor':'pointer'}"
                                class="help-list">{{helpSubElement}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                
                <div
                [ngStyle]="{
                'width': '75%',
                'display': 'inline-block',
                'top': '0px',
                'left': '25%',
                'position': 'absolute',
                'text-align': 'center'}">
                    <event-help
                    *ngIf="renderEvent()"
                    [selectedSubComponent]="selectedElement"></event-help>
                    <edge-help
                    *ngIf="renderEdge()"
                    [selectedSubComponent]="selectedElement"></edge-help>
                    <globals-help
                    *ngIf="renderGlobals()"
                    [selectedSubComponent]="selectedElement"></globals-help>
                    <graph-help
                    *ngIf="renderGraph()"
                    [selectedSubComponent]="selectedElement"></graph-help>
                    <javascript-help
                    *ngIf="renderJavascript()"
                    [selectedSubComponent]="selectedElement"></javascript-help>
                </div>
            </div>
        </modal-body>
    </modal>
    `,
    directives: [MODAL_DIRECTIVES, NgStyle, EventHelp, EdgeHelp, GraphHelp, GlobalsHelp, JavascriptHelp]
})

export class HelpDialogue {
    @ViewChild('modal') modal: ModalComponent;

    helpListKeys: any = ['Events', 'Edges', 'Globals', 'Graph', 'Javascript'];
    helpListSubkeys: any = {'Events': ['Creating an Event', 'Editing an Event', 'Private Variables'],
                            'Edges': ['Creating an Edge', 'Editing an Edge', 'Pending Edges', 'Cancelling Edges', 'Parameters'],
                            'Globals': ['Creating Global Variables', 'Accessing Global Variables', 'Time Units', 'Console Output'],
                            'Graph': ['Tracing Output'],
                            'Javascript': ['General', 'Variables', 'Functions', 'Arrays', 'Objects']}
    selectedElement = 'Creating an Event';

    selectHelpElement(element: string) {
        this.selectedElement = element;
    }

    open() {
        this.modal.open('lg');
    }

    renderEvent() {
        return this.selectedElement == 'Creating an Event'
            || this.selectedElement == 'Editing an Event'
            || this.selectedElement == 'Private Variables';

    }

    renderEdge() {
        return this.selectedElement == 'Creating an Edge'
            || this.selectedElement == 'Editing an Edge'
            || this.selectedElement == 'Pending Edges'
            || this.selectedElement == 'Cancelling Edges'
            || this.selectedElement == 'Parameters';
    }

    renderGlobals() {
        return this.selectedElement == 'Creating Global Variables'
            || this.selectedElement == 'Accessing Global Variables'
            || this.selectedElement == 'Time Units'
            || this.selectedElement == 'Console Output';
    }

    renderGraph() {
        return this.selectedElement == 'Tracing Output';
    }

    renderJavascript() {
        return this.selectedElement == 'General'
            || this.selectedElement == 'Variables'
            || this.selectedElement == 'Functions'
            || this.selectedElement == 'Arrays'
            || this.selectedElement == 'Objects';
    }

}
