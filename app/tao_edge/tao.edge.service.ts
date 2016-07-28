/**
 * Created by abhinadduri on 4/24/16.
 */
// calculate css transformations
import {Injectable} from '@angular/core';
import {Edge} from './tao.edge.model';

@Injectable()
export class EdgeService {
    private radToDeg = 180 / Math.PI;

    public getLengthFromEdge(
        edge : Edge
    ) : string {
        var dx : number = parseInt(edge.endX) - parseInt(edge.startX);
        var dy : number = parseInt(edge.endY) - parseInt(edge.startY);
        return (Math.sqrt(dx*dx + dy*dy) - 37) + 'px';
    }

    public getLengthFromCoordinates(
        startX : string,
        startY : string,
        endX : string,
        endY : string
    ) : string {
        var dx : number = parseInt(endX) - parseInt(startX);
        var dy : number = parseInt(endY) - parseInt(startY);
        return (Math.sqrt(dx*dx + dy*dy) - 37) + 'px';
    }

    public getAngleFromCoordinates(
        startX : string,
        startY : string,
        endX : string,
        endY : string
    ) : string {
        var dx : number = parseInt(endX) - parseInt(startX);
        var dy : number = parseInt(endY) - parseInt(startY);

        return (Math.atan2(dy, dx) * this.radToDeg).toFixed(2) + 'deg';
    }

    public getAngleFromEdge(
        edge : Edge
    ) : string {
        var dx : number = parseInt(edge.endX) - parseInt(edge.startX);
        var dy : number = parseInt(edge.endY) - parseInt(edge.startY);

        return (Math.atan2(dy, dx) * this.radToDeg).toFixed(2) + 'deg';
    }

    public twoWayEdge(
        edge: Edge,
        edgeList: Edge[]
    ) : boolean {
        let source = edge.source;
        let target = edge.target;
        let groupedSource = edge.groupedSource;
        let groupedTarget = edge.groupedTarget;
        if (source == target)
            return false;

        for (var i = 0; i < edgeList.length; i++) {
            let currentEdge = edgeList[i];

            if (source == currentEdge.target && target == currentEdge.source ||
                ((groupedSource != "None" || groupedTarget != "None") &&
                groupedSource == currentEdge.groupedTarget && groupedTarget == currentEdge.groupedSource))
                return true;
        }

        return false;
    }

    // only called if pair exists

    public getEdgePair(
        edge: Edge,
        edgeList: Edge[]
    ) : Edge {
        let source = edge.source;
        let target = edge.target;
        let groupedSource = edge.groupedSource;
        let groupedTarget = edge.groupedTarget;

        for (var i = 0; i < edgeList.length; i++) {
            let currentEdge = edgeList[i];

            if (source == currentEdge.target && target == currentEdge.source ||
                groupedSource == currentEdge.groupedTarget && groupedTarget == currentEdge.groupedSource)

                return currentEdge;
        }
    }
}