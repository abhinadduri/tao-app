/**
 * Created by abhinadduri on 4/24/16.
 */
import {Event} from '../tao_event/tao.event.model'

export class Edge {
    constructor(
        public source: string,
        public target: string,
        public startX: string,
        public startY: string,
        public endX: string,
        public endY: string,
        public condition: any,
        public type: string,
        public delay: number,
        public priority: number,
        public parameters: any,
        public description: string
    ) { }

    public getSourceEvent(eventList: Event[]) : Event {
        for (var event in eventList) {
            if (eventList[event].name === this.source)
                return eventList[event];
        }
        return null;
    }

    public getTargetEvent(eventList: Event[]) : Event {
        for (var event in eventList) {
            if (eventList[event].name === this.target)
                return eventList[event];
        }
        return null;
    }

    public getCopies(edgeList: Edge[]) : Edge[] {
        var listOfCopies: Edge[] = [];
        for (var edge in edgeList) {
            var currentEdge: Edge = edgeList[edge];
            if (currentEdge.source == this.source && currentEdge.target == this.target)
                listOfCopies.push(currentEdge);
        }
        return listOfCopies;
    }
}