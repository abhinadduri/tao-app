/**
 * Created by abhinadduri on 4/24/16.
 */
import {Event} from '../tao_event/tao.event.model';

export class Edge {
    constructor(
        public source: string,
        public target: string,
        public startX: string,
        public startY: string,
        public endX: string,
        public endY: string,
        public condition: any,
        public endCondition: any,
        public type: string,
        public delay: number,
        public priority: number,
        public parameters: any,
        public description: string,
        public subType: string,
        public groupedSource: string,
        public groupedTarget: string,
        public visible: boolean,
        private id: string
    ) { }

    public getId(): string {
        return this.id;
    }

    public equals(e: Edge): boolean {
        return this.getId() == e.getId();
    }

    public getSourceEvent(eventList: Event[]): Event {
        for (let event in eventList) {
            if (eventList[event].name === this.source)
                return eventList[event];
        }
        return null;
    }

    public getTargetEvent(eventList: Event[]): Event {
        for (let event in eventList) {
            if (eventList[event].name === this.target)
                return eventList[event];
        }
        return null;
    }

    public getCopies(edgeList: Edge[], eventList: Event[]): Edge[] {
        let listOfCopies: Edge[] = [];
        for (let edge in edgeList) {
            let currentEdge: Edge = edgeList[edge];
            if (currentEdge.source == this.source && currentEdge.target == this.target)
                listOfCopies.push(currentEdge);
            else if (currentEdge.groupedSource == "None" &&
                     this.groupedSource == "None" &&
                     currentEdge.source == this.source &&
                     currentEdge.groupedTarget != "None" &&
                     currentEdge.groupedTarget == this.groupedTarget)
                listOfCopies.push(currentEdge);
            else if (currentEdge.groupedSource != "None" &&
                     this.groupedSource == currentEdge.groupedSource &&
                     currentEdge.target == this.target)
                listOfCopies.push(currentEdge);
            else if (currentEdge.groupedSource != "None" &&
                     this.groupedSource == currentEdge.groupedSource &&
                     currentEdge.groupedTarget != "None" &&
                     currentEdge.groupedTarget == this.groupedTarget)
                listOfCopies.push(currentEdge);
        }
        return listOfCopies;
    }

}