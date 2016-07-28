/**
 * Created by abhinadduri on 7/1/16.
 */
import {Event} from '../tao_event/tao.event.model';
import {Edge} from '../tao_edge/tao.edge.model';
import {Regex} from '../resources/constants';

enum EDGE {
    SOURCE = 0,
    TARGET = 1
}

export class Validation {
    public static testValidVariableName(name: string): boolean {
        return ((Regex.taoIdentifier.test(name)) &&
               !Regex.regexES6ReservedWord.test(name) &&
               !Regex.regexImmutableProps.test(name) &&
               !Regex.regexZeroWidth.test(name));
    }

    public static isNumArray(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] != "number")
                return false
        }
        return true;
    }

    public static checkNames(eventList: Event[]): boolean {
        for (let i = 0; i < eventList.length; i++) {
            let name = eventList[i].name;

            if (!Validation.testValidVariableName(name)) {
                alert(name + ' is not a valid name for an event.');
                return false;
            }
        }

        return true;
    }

    public static checkParameters(eventList: Event[], edgeList: Edge[]): boolean {
        for (let i = 0; i < eventList.length; i++) {
            let currentEvent = eventList[i];
            let currentParams = currentEvent.parameters;

            let targetEdges: Edge[] = Validation.getTargetEdges(currentEvent, edgeList);
            for (let i in currentParams) {
                for (let j = 0; j < targetEdges.length; j++) {
                    if (!targetEdges[j].parameters.hasOwnProperty(i)
                        || targetEdges[j].parameters[i] == "") {
                        alert('A parameter field for parameter ' + i + ' of event ' + currentEvent.name + ' has been left blank.');
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public static getSourceEdges(node: Event, edgeList: Edge[]): Edge[] {
        let output: Edge[] = [];
        for (let i = 0; i < edgeList.length; i++) {
            if (edgeList[i].source === node.name)
                output.push(edgeList[i]);
        }

        return output;
    }

    public static getTargetEdges(node: Event, edgeList: Edge[]): Edge[] {
        let output: Edge[] = [];
        for (let i = 0; i < edgeList.length; i++) {
            if (edgeList[i].target === node.name)
                output.push(edgeList[i]);
        }

        return output;
    }
}