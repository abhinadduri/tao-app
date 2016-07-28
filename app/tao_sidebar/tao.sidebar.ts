/**
 * Created by abhinadduri on 4/26/16.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgStyle} from '@angular/common';
import {CORE_DIRECTIVES} from '@angular/common';
import {HelpDialogue} from './tao.help';
import {Event} from '../tao_event/tao.event.model';
import {Edge} from '../tao_edge/tao.edge.model';
import {Group} from '../tao_group/tao.group.model'
import {TaoGraph} from '../tao_graph/tao.graph';
import {Ace, Panel} from '../resources/constants';

import {TaoVariablePanel} from '../tao_sidebar/tao.variable.panel'

@Component({
    selector: 'sidebar',
    templateUrl: './app/tao_sidebar/tao.sidebar.tpl.html',
    directives: [NgStyle, CORE_DIRECTIVES, TaoVariablePanel, HelpDialogue, TaoGraph]
})

export class TaoSidebar {
    @Input() selectedParticle;
    @Input() eventList;
    @Input() edgeList;
    @Input() variableList;
    @Input() groupList;
    @Input() groupStart;
    @Input() graphData;
    @Input() graphVar;
    @Input() threads;
    @Input() copyVariable;

    @Input() variablePanel: boolean;

    @Input() simulationName: string;
    @Input() simulationDescription: string;
    @Input() timeUnits: number;
    @Input() threads: number;
    
    @Output() resetParticle = new EventEmitter();
    @Output() downloadERG = new EventEmitter();
    @Output() runERG = new EventEmitter();
    @Output() openERG = new EventEmitter();

    @Output() changeNameERG = new EventEmitter();
    @Output() changeDescriptionERG = new EventEmitter();
    @Output() changeTimeERG = new EventEmitter();
    @Output() changeThreadNumber = new EventEmitter();
    @Output() historyUpdate = new EventEmitter();
    @Output() undo = new EventEmitter();
    @Output() changeGraphVar = new EventEmitter();
    @Output() localRun = new EventEmitter();
    @Output() copy = new EventEmitter();
    @Output() paste = new EventEmitter();
    @Output() group = new EventEmitter();
    @Output() ungroup = new EventEmitter();
    
    
    emptyDict: any = {};
    emptyList: any = [];

    handleDownload() {
        this.downloadERG.emit(0);
    }

    handleRun() {
        this.runERG.emit(0);
    }

    handleLocalRun() {
        this.localRun.emit(0);
    }

    handleOpen(file) {
        this.openERG.emit(file);
    }

    handleUndo() {
        this.undo.emit(0);
    }

    launchHelp() {
        this.selectedParticle = null;
    }

    loadVariablePanel() {
        this.resetParticle.emit(0);
    }
    
    setEdge(edge: Edge) {
        this.selectedParticle = edge;
    }

    emitNameERG(event) {
        this.changeNameERG.emit(event);
        this.emitHistoryUpdate();
    }

    emitDescriptionERG(event) {
        this.changeDescriptionERG.emit(event);
        this.emitHistoryUpdate();
    }

    emitTimeERG(event) {
        this.changeTimeERG.emit(event);
        this.emitHistoryUpdate();
    }

    emitThreadNumber(event) {
        this.changeThreadNumber.emit(event);
        this.emitHistoryUpdate();
    }

    emitChangeGraph(event) {
        this.changeGraphVar.emit(event);
    }

    logError(err) {
        console.error(err);
    }

    typeOfNode() {
        return (!(this.selectedParticle)) ? false : (this.selectedParticle.constructor == Event);
    }

    typeOfEdge() {
        return (!(this.selectedParticle)) ? false : (this.selectedParticle.constructor == Edge);
    }

    typeOfGroup() {
        return (!(this.selectedParticle) ? false : (this.selectedParticle.constructor == Group));
    }

    emitHistoryUpdate() {
        this.historyUpdate.emit(0);
    }

    storeCopiedVariable() {
        if (this.typeOfNode() && this.selectedParticle.name == 'Run') {
            alert('Cannot copy the Run node.');
            return;
        }
        this.copy.emit(0);
    }

    pasteItem() {
        this.paste.emit(0);
    }
    
    beginGroup() {
        this.group.emit(0);
    }

    handleUngroup() {
        if (!this.typeOfGroup())
            return;
        
        this.ungroup.emit(this.selectedParticle);
    }

    updateEvent(eventName, trace, stateChange, description) {
        // change all edges pointed to this event.

        let sourceEdges: Edge[] = this.selectedParticle.getSourceEdges(this.edgeList);
        let targetEdges: Edge[] = this.selectedParticle.getTargetEdges(this.edgeList);

        for (let i = 0; i < sourceEdges.length; i++) {
            let edge: Edge = sourceEdges[i];
            edge.source = eventName.value;
            edge.description = "Edge from " + edge.source + " to " + edge.target + ".";
        }
        for (let j = 0; j < targetEdges.length; j++) {
            let edge: Edge = targetEdges[j];
            edge.target = eventName.value;
            edge.description = "Edge from " + edge.source + " to " + edge.target + ".";
        }

        if (this.selectedParticle.description == this.selectedParticle.name + " description.")
            this.selectedParticle.description = eventName.value + " description.";
        else
            this.selectedParticle.description = description.value;

        this.selectedParticle.name = eventName.value;
        this.selectedParticle.trace = trace.checked;
        this.selectedParticle.stateChange = stateChange.value;


        this.emitHistoryUpdate();
    }

    // only called if selected particle is an edge

    updateEdge(edgeType, edgeCondition, edgeDelay, edgePriority, edgeParameters, edgeDescription, edgeSubType) {
        this.selectedParticle.type = edgeType.value;
        this.selectedParticle.condition = edgeCondition.value;
        this.selectedParticle.delay = edgeDelay.value;
        this.selectedParticle.priority = edgePriority.value;
        this.selectedParticle.description = edgeDescription.value;
        if (edgeSubType)
            this.selectedParticle.subType = edgeSubType.value;

        var paramsList = edgeParameters.getElementsByTagName("li");

        for (var i = 0; i < paramsList.length; i++) {
            var li = paramsList[i];
            var span = li.getElementsByTagName("span")[0].textContent;
            var value = li.getElementsByTagName("input")[0].value;

            this.selectedParticle.parameters[span] = value;
        }
        this.emitHistoryUpdate();

    }

    keys(params) {
        return Object.keys(params);
    }

    deleteParameterEvent(parameter) {
        // if this function is being called, selectedParticle cannot possibly be null
        // can change this to only make permanent changes on an update
        delete this.selectedParticle.parameters[parameter];

        this.emitHistoryUpdate();
    }

    changeEventParameterName(parameterName, oldName) {
        let name = parameterName.value;
        if (this.selectedParticle.parameters.hasOwnProperty(oldName)) {
            this.selectedParticle.parameters[name] = null;
            delete this.selectedParticle.parameters[oldName];
        }

        let targetEdges: Edge[] = this.selectedParticle.getTargetEdges(this.edgeList);
        for (let i = 0; i < targetEdges.length; i++) {
            let currentEdge = targetEdges[i];
            if (currentEdge.parameters.hasOwnProperty(oldName)) {
                currentEdge.parameters[name] = currentEdge.parameters[oldName];
                delete currentEdge.parameters[oldName];
            } else {
                currentEdge.parameters[name] = null;
            }
        }

        this.emitHistoryUpdate();
    }

    addParameterToEvent(param) {
        // will only be called if selected particle is a node
        this.selectedParticle.parameters[param.value] = null;
        param.value = "";

        this.emitHistoryUpdate();
    }

    deleteEvent(event: Event) {
        if (event.name == 'Run') {
            alert('You cannot delete the run node.');
            return;
        }
        let spliceIndices = [];

        for (var i = 0; i < this.edgeList.length; i++) {
            let currentEdge = this.edgeList[i];

            if (currentEdge.target == event.name
                || currentEdge.source == event.name) {
                spliceIndices.push(i)
            }
        }

        for (let j = spliceIndices.length - 1; j >= 0; j--) {
            this.edgeList.splice(spliceIndices[j], 1);
        }

        let index = this.eventList.indexOf(event);

        this.eventList.splice(index, 1);
        this.emitHistoryUpdate();
        this.resetParticle.emit(Panel.reset);
    }

    deleteEdge() {
        let index = this.edgeList.indexOf(this.selectedParticle);

        this.edgeList.splice(index, 1);
        this.emitHistoryUpdate();
    }

    deleteGroupEvent(event: Event) {
        if (!this.typeOfGroup())
            return;

        let group: Group = this.selectedParticle;
        let spliceIncomingIndices = [];
        let spliceOutgoingIndices = [];
        let spliceInternalIndices = [];

        for (let i = 0; i < group.getIncomingEdges().length; i++) {
            let currentEdge = group.getIncomingEdges()[i];

            if (currentEdge.target == event.name)
                spliceIncomingIndices.push(i);
        }

        for (let j = 0; j < group.getOutgoingEdges().length; j++) {
            let currentEdge = group.getOutgoingEdges()[j];

            if (currentEdge.source == event.name)
                spliceOutgoingIndices.push(j);
        }

        for (let k = 0; k < group.getEdges().length; k++) {
            let currentEdge = group.getEdges()[k];

            if (currentEdge.source == event.name || currentEdge.target == event.name) {
                spliceInternalIndices.push(k);
            }
        }

        for (let i = spliceIncomingIndices.length - 1; i >= 0; i--)
            group.getIncomingEdges().splice(spliceIncomingIndices[i], 1);

        for (let j = spliceOutgoingIndices.length - 1; j >= 0; j--)
            group.getOutgoingEdges().splice(spliceOutgoingIndices[j], 1);

        for (let k = spliceInternalIndices.length - 1; k >= 0; k--)
            group.getEdges().splice(spliceInternalIndices[k], 1);


        group.getEvents().splice(group.getEvents().indexOf(event), 1);

        this.deleteEvent(event);

    }

    deleteGroupEdge(edge: Edge) {
        if (!this.typeOfGroup())
            return;

        let group = this.selectedParticle;

        group.getEdges().splice(group.getEdges().indexOf(edge), 1);
        this.edgeList.splice(this.edgeList.indexOf(edge), 1);
    }

}