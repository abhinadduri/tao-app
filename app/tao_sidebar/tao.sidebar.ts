/**
 * Created by abhinadduri on 4/26/16.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgStyle} from '@angular/common';
import {CORE_DIRECTIVES} from '@angular/common';
import {HelpDialogue} from './tao.help';
import {Event} from '../tao_event/tao.event.model'
import {Edge} from '../tao_edge/tao.edge.model'
import {TaoGraph} from '../tao_graph/tao.graph'

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
    @Input() graphData;
    @Input() graphVar;
    @Input() threads;

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
    
    
    emptyDict: any = {};
    emptyList: any = [];

    handleDownload() {
        this.downloadERG.emit(0);
    }

    handleRun() {
        this.runERG.emit(0);
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

    emitHistoryUpdate() {
        this.historyUpdate.emit(0);
    }

    updateEvent(eventName, trace, stateChange) {
        this.selectedParticle.name = eventName.value;
        this.selectedParticle.trace = trace.checked;
        this.selectedParticle.stateChange = stateChange.value;

        this.emitHistoryUpdate();
    }

    // only called if selected particle is an edge

    updateEdge(edgeType, edgeCondition, edgeDelay, edgePriority, edgeParameters) {
        this.selectedParticle.type = edgeType.value;
        this.selectedParticle.condition = edgeCondition.value;
        this.selectedParticle.delay = edgeDelay.value;
        this.selectedParticle.priority = edgePriority.value;

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

    addParameterToEvent(param) {
        // will only be called if selected particle is a node
        this.selectedParticle.parameters[param.value] = null;
        param.value = "";

        this.emitHistoryUpdate();
    }

    deleteEvent() {
        if (this.selectedParticle.name == 'Run') {
            alert('You cannot delete the run node.');
            return;
        }
        let spliceIndices = [];

        for (var i = 0; i < this.edgeList.length; i++) {
            let currentEdge = this.edgeList[i];

            if (currentEdge.target == this.selectedParticle.name
                || currentEdge.source == this.selectedParticle.name) {
                spliceIndices.push(i)
            }
        }

        for (var j = 0; j < spliceIndices.length; j++) {
            this.edgeList.splice(spliceIndices[i]);
        }

        let index = this.eventList.indexOf(this.selectedParticle);

        this.eventList.splice(index, 1);
        this.emitHistoryUpdate();
        this.resetParticle.emit('reset all');
    }

    deleteEdge() {
        let index = this.edgeList.indexOf(this.selectedParticle);

        this.edgeList.splice(index, 1);
        this.emitHistoryUpdate();
    }

}