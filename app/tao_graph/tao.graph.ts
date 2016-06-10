/**
 * Created by abhinadduri on 6/9/16.
 */
import {Component, ViewChild, Input} from '@angular/core';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal'
import {NgStyle} from '@angular/common';

@Component({
    selector: 'graph',
    template: `
    <modal #background
           [ngStyle]="{'height': '800px'}">
        <modal-header [show-close]="true">
            <h4 class="modal-title" style="text-align: center;">Graph Output</h4>
        </modal-header>
        <modal-body>
            <div id="data" [ngStyle]="{'margin': '0 auto'}"></div>
            <div id="dataFooter">
                <button 
                *ngFor="let num of iterableNumber()"
                (click)="updateGraph(num)">
                    Thread {{num + 1}}
                </button>
            </div>
        </modal-body>
    </modal>
    `,
    directives: [MODAL_DIRECTIVES, ModalComponent, NgStyle]
})

export class TaoGraph {
    @ViewChild('background') modal: ModalComponent;
    @Input() graphData: any;
    @Input() graphingVariable: string;
    @Input() threads: number;

    open() {
        if (_.isEmpty(this.graphData) || this.graphData == null || this.graphingVariable == null) {
            alert('No data on global variables yet! Run a simulation with global variables.');
            return;
        } else {
            let selectedGraphData = this.graphData[0][this.graphingVariable];

            if (!selectedGraphData) {
                alert('No valid graph data. You can only graph global variables that are numbers.');
                return;
            }

            let xValues:any[] = Object.keys(selectedGraphData);
            let graphValues:any[] = [];
            for (let i = 0; i < xValues.length; i++) {
                graphValues.push([parseInt(xValues[i]), selectedGraphData[xValues[i]]]);
            }
            let g = new Dygraph(document.getElementById('data'),
                graphValues,
                {
                    legend: 'always',
                    animatedZooms: true,
                    labels: ['time', this.graphingVariable]
                }
            );
            g.resize(800, 500);
            this.modal.open('lg');
        }
    }

    iterableNumber() {
        let arr: number[] = [];
        for (let i = 0; i < this.threads; i++)
            arr.push(i);
        return arr;
    }

    updateGraph(threadNum: number) {
        let selectedGraphData = this.graphData[threadNum][this.graphingVariable];

        if (!selectedGraphData) {
            alert('Error');
            return;
        }
        let xValues:any[] = Object.keys(selectedGraphData);
        let graphValues:any[] = [];
        for (let i = 0; i < xValues.length; i++) {
            graphValues.push([parseInt(xValues[i]), selectedGraphData[xValues[i]]]);
        }
        let g = new Dygraph(document.getElementById('data'),
            graphValues,
            {
                legend: 'always',
                animatedZooms: true,
                labels: ['time', this.graphingVariable]
            }
        );
        g.resize(800, 500);
    }
}