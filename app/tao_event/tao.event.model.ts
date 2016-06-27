/**
 * Created by abhinadduri on 4/24/16.
 */
import {Edge} from '../tao_edge/tao.edge.model'

export class Event {
    constructor(
        public name: string,
        public stateChange: string,
        public x: string,
        public y: string,
        public trace: boolean,
        public parameters: {},
        public description: string
    ) { }

    public getSourceEdges(edgeList: Edge[]): Edge[] {
        let edges: Edge[] = [];

        for (let i = 0; i < edgeList.length; i++) {
            if (edgeList[i].source == this.name)
                edges.push(edgeList[i]);
        }
        return edges;
    }

    public getTargetEdges(edgeList: Edge[]): Edge[] {
        let edges: Edge[] = [];

        for (let i = 0; i < edgeList.length; i++) {
            if (edgeList[i].target == this.name)
                edges.push(edgeList[i]);
        }
        return edges;
    }
}
