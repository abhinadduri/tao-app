/**
 * Created by abhinadduri on 7/10/16.
 */
import {Event} from '../tao_event/tao.event.model';
import {Edge} from '../tao_edge/tao.edge.model';

export class Group {
    eventList: Event[];
    edgeList: Edge[];
    outgoingEdges: Edge[];
    incomingEdges: Edge[];
    includedGroups: Group[];
    parent: Group;
    visible: boolean;
    grouped: boolean;
    groupedDOM: boolean;

    constructor(public name: string,
                public x: string,
                public y: string) {
        this.eventList = [];
        this.edgeList = [];
        this.outgoingEdges = [];
        this.incomingEdges = [];
        this.includedGroups = [];
        this.parent = null;
        this.visible = false;
    }

    public getEvents(): Event[] {
        return this.eventList;
    }

    public getEventByEdgeSource(e: Edge): Event {
        let ind = this.getEventByName(e.source);
        if (ind == -1)
            return null;
        else return this.eventList[ind];
    }

    public getEventByEdgeTarget(e: Edge): Event {
        let ind = this.getEventByName(e.target);
        if (ind == -1)
            return null;
        else return this.eventList[ind];
    }

    public getEdges(): Edge[] {
        return this.edgeList;
    }

    public addEvent(e: Event) {
        this.eventList.push(e);
    }

    public removeEvent(e: Event) {
        this.eventList.splice(this.eventList.indexOf(e), 1);
    }

    public addEdge(e: Edge) {
        this.edgeList.push(e)
    }

    public getOutgoingEdges(): Edge[] {
        return this.outgoingEdges;
    }

    public getIncomingEdges(): Edge[] {
        return this.incomingEdges;
    }

    public addOutgoingEdge(e: Edge) {
        this.outgoingEdges.push(e);
    }

    public addIncomingEdge(e: Edge) {
        this.incomingEdges.push(e);
    }

    public getGroups(): Group[] {
        return this.includedGroups;
    }

    public addGroup(g: Group) {
        this.includedGroups.push(g);
    }

    public getEventByName(name: string): number {
        for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].name == name)
                return i;
        }

        return -1;
    }

    public getEventObjectByName(name: string): Event {
        for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].name == name)
                return this.eventList[i];
        }

        return null;
    }

    public find(e: Event): Group {
        let ind = this.eventList.indexOf(e);
        if (ind != -1)
            return this;
        else
            for (let i = 0; i < this.includedGroups.length; i++) {
                return this.includedGroups[i].find(e);
            }
        return null;
    }

    public findByName(name: string): Group {
        if (this.getEventByName(name) != -1)
            return this;
        else
            for (let i = 0; i < this.includedGroups.length; i++) {
                return this.includedGroups[i].findByName(name);
            }

        return null;
    }
}