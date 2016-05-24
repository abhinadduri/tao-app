/**
 * Created by abhinadduri on 4/24/16.
 */
import {Component, Input} from '@angular/core';
import {NgStyle, NgClass} from '@angular/common';
import {EdgeService} from './tao.edge.service'
import {Edge} from './tao.edge.model'

@Component({
    selector: 'edge',
    templateUrl: './app/tao_edge/tao.edge.tpl.html',
    directives: [NgStyle, NgClass]
})

export class TaoEdge {
    @Input() tao_edge;
    @Input() selected;
    @Input() edgeList;

    getLength() : string {
        return this.edgeService.getLengthFromEdge(this.tao_edge);
    }

    getAngle() : string {
        return this.edgeService.getAngleFromEdge(this.tao_edge);
    }

    twoWayEdge() : boolean {
        return this.edgeService.twoWayEdge(this.tao_edge, this.edgeList);
    }
    
    getEdgePair() : Edge {
        return this.edgeService.getEdgePair(this.tao_edge, this.edgeList);
    }

    calculateDisplacement() : number {
        let otherEdge: Edge = this.getEdgePair();

        if (this.edgeList.indexOf(this.tao_edge) > this.edgeList.indexOf(otherEdge))
            return 3;
        else
            return -3;
    }

    parse(x) {
        return parseInt(x);
    }

    constructor(public edgeService : EdgeService) { }
}
