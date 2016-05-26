import {Component, OnInit} from '@angular/core';
import {TaoEvent} from './../tao_event/tao.event'
import {TaoEdge} from './../tao_edge/tao.edge'
import {TaoSidebar} from './../tao_sidebar/tao.sidebar'
import {Edge} from './../tao_edge/tao.edge.model'
import {Event} from './../tao_event/tao.event.model'
import {Variable} from './../tao_variable/tao.variable.model'
import {ErgTemplate} from './erg.template'
import {Engine} from './erg.engine'

@Component({
    selector: 'erg',
    directives: [TaoEvent, TaoEdge, TaoSidebar],
    templateUrl: './app/tao_erg/erg.component.tpl.html'
})

export class ErgComponent implements OnInit {

    counter: number;
    selectedParticle: any;
    shiftSelectedSource: Event;
    selectedVariablePanel: boolean;
    eventList: Event[];
    edgeList: Edge[];
    variableList: Variable[];
    simulationName: string;
    simulationDescription: string;
    timeUnits: number;

    ngOnInit() {
        this.counter = 1;
        this.selectedParticle = null;
        this.shiftSelectedSource = null;
        this.selectedVariablePanel = false;
        this.simulationName = "Simulation";
        this.simulationDescription = "A sample description.";
        this.timeUnits = 5;

        this.eventList = [
            new Event("Run", "// your code here", "50", "50", false, {})
        ];

        this.edgeList = [];

        this.variableList = [];
    }

    
    handleDownload() {
        console.log(JSON.stringify(this.produceErgJSON()));
    }

    handleRun() {
        let generatedCode = ErgTemplate.makeTemplate(this.produceErgJSON());

        let engine = new Engine();

        let compiledFunction = eval('(' + generatedCode + ')');
        let codeToRun = new compiledFunction();

        engine.execute(codeToRun, this.timeUnits);
    }

    handleOpen(e) {
        // let file = new FileReader();
        let file = e.target.files[0];
        if (!file) {
            return;
        }

        let reader = new FileReader();

        let self = this;

        reader.onload = function(e) {
            let target: any = e.target;

            self.loadFromText(target.result);
        }

        reader.readAsText(file);
    }



    createEvent(e, graph) {
        if (e.target == graph) {
            var name = "Event" + this.counter;
            var x = (e.clientX - 35).toString();
            var y = (e.clientY - 35).toString();
            var stateChange = `// your code here`;
            var event = new Event(name, stateChange, x, y, true, {});
            this.counter++;
            this.eventList.push(event);
        }
    }
    
    unSelect(graph, e) {
        if (e.target == graph) {
            this.selectedParticle = null;
            this.shiftSelectedSource = null;

            this.selectedVariablePanel = false;
        }
    }

    unSelectFromPanel() {
        this.selectedParticle = null;
        this.shiftSelectedSource = null;

        this.selectedVariablePanel = true
    }

    selectEvent(event: Event, e) {
        if (e.shiftKey)
            this.selectShiftEvent(event, e);
        else {
            this.selectedVariablePanel = false;
            this.selectedParticle = event;
            // this.loadPanelEvent(event, e);
        }
    }


    selectShiftEvent(event : Event, e) {
        if (!this.shiftSelectedSource)
            this.shiftSelectedSource = event;
        else if (this.shiftSelectedSource) {
            // can optimize this maybe
            this.createEdge(this.shiftSelectedSource.name, event.name);
            this.shiftSelectedSource = null;
        }

    }

    createEdge(source : string, target : string) {
        var sourceEvent : Event = null;
        var targetEvent : Event = null;

        for (var i = 0; i < this.eventList.length; i++) {
            var currentEvent : Event = this.eventList[i];
            if (currentEvent.name === source)
                sourceEvent = currentEvent;
            if (currentEvent.name === target)
                targetEvent = currentEvent;
        }

        var newEdge : Edge = new Edge(
            source,
            target,
            (parseInt(sourceEvent.x) + 35).toString(),
            (parseInt(sourceEvent.y) + 35).toString(),
            (parseInt(targetEvent.x) + 35).toString(),
            (parseInt(targetEvent.y) + 35).toString(),
            'true',
            'Scheduling',
            1,
            5,
            {}
        );

        this.edgeList.push(newEdge);
    }
    
    selectEdge(edge: Edge, e) {
        this.selectedVariablePanel = false;
        this.selectedParticle = edge;
    }

    // given an event, get all edges whose source/target is that event
    getSourceAndTargetEdges(node: Event) : any {
        var output = {'source': [], 'target': []};
        for (var i = 0; i < this.edgeList.length; i++) {
            if (this.edgeList[i].source === node.name)
                output['source'].push(this.edgeList[i]);
            // fix this for self edges
            if (this.edgeList[i].target === node.name)
                output['target'].push(this.edgeList[i]);
        }
        return output;
    }

    handleDrag(node: Event) {
        var sourceAndTarget = this.getSourceAndTargetEdges(this.selectedParticle);
        var sourceEdges = sourceAndTarget['source'];
        var targetEdges = sourceAndTarget['target'];

        for (var i = 0; i < sourceEdges.length; i++) {
            sourceEdges[i].startX = (parseInt(node.x) + 35).toString();
            sourceEdges[i].startY = (parseInt(node.y) + 35).toString();
        }
        for (var i = 0; i < targetEdges.length; i++) {
            targetEdges[i].endX = (parseInt(node.x) + 35).toString();
            targetEdges[i].endY = (parseInt(node.y) + 35).toString();
        }
    }

    produceErgJSON() : any {
        let simulation = {};

        simulation['name'] = this.simulationName;
        simulation['time'] = this.timeUnits;

        simulation['variables'] = [];

        for (var i = 0; i < this.variableList.length; i++) {
            let currentVariable = this.variableList[i];

            simulation['variables'].push(
                {
                    'name': currentVariable.name,
                    'value': currentVariable.value,
                    'description': currentVariable.description
                }
            );
        }

        simulation['edges'] = [];

        for (var i = 0; i < this.edgeList.length; i++) {
            let currentEdge = this.edgeList[i];

            simulation['edges'].push(
                {
                    'source': currentEdge.source,
                    'target': currentEdge.target,
                    'startX': currentEdge.startX,
                    'startY': currentEdge.startY,
                    'endX': currentEdge.endX,
                    'endY': currentEdge.endY,
                    'condition': currentEdge.condition,
                    'type': currentEdge.type,
                    'delay': currentEdge.delay,
                    'priority': currentEdge.priority,
                    'parameters': currentEdge.parameters
                }
            )
        }

        simulation['events'] = [];

        for (var i = 0; i < this.eventList.length; i++) {
            let currentEvent = this.eventList[i];

            simulation['events'].push(
                {
                    'name': currentEvent.name,
                    'stateChange': currentEvent.stateChange,
                    'x': currentEvent.x,
                    'y': currentEvent.y,
                    'trace': currentEvent.trace,
                    'parameters': currentEvent.parameters
                }
            )
        }
        // console.log(simulation);
        return simulation;
    }

    loadFromText(simulation: string) {
        let simJson = JSON.parse(simulation);
        this.clearERG();


        this.simulationName = simJson.hasOwnProperty('name') ? simJson.name : 'Simulation';
        this.timeUnits = simJson.hasOwnProperty('time') ? simJson.time : 10;

        if (simJson.hasOwnProperty('variables')) {
            for (var i = 0; i < simJson.variables.length; i++) {
                let currentVariable = simJson.variables[i];

                this.variableList.push(
                    new Variable(
                        (currentVariable.hasOwnProperty('name') ? currentVariable.name : 'Variable' + i),
                        (currentVariable.hasOwnProperty('value') ? currentVariable.value : 0),
                        (currentVariable.hasOwnProperty('description') ? currentVariable.description : 'Description'))
                );
            }
        }

        if (simJson.hasOwnProperty('events')) {
            for (var i = 0; i < simJson.events.length; i++) {
                let currentEvent = simJson.events[i];

                this.eventList.push(
                    new Event(
                        (currentEvent.hasOwnProperty('name') ? currentEvent.name : 'Event' + i),
                        (currentEvent.hasOwnProperty('stateChange') ? currentEvent.stateChange : '// your code here'),
                        (currentEvent.hasOwnProperty('x') ? currentEvent.x.toString() : (i * 100).toString()),
                        (currentEvent.hasOwnProperty('y') ? currentEvent.y.toString() : (i * 100).toString()),
                        (currentEvent.hasOwnProperty('trace') ? currentEvent.trace : true),
                        (currentEvent.hasOwnProperty('parameters') ? currentEvent.parameters : {}))
                );
            }
        }

        if (simJson.hasOwnProperty('edges')) {
            for (var i = 0; i < simJson.edges.length; i++) {
                let currentEdge = simJson.edges[i];

                this.edgeList.push(
                    new Edge(
                        (currentEdge.hasOwnProperty('source') ? currentEdge.source : null),
                        (currentEdge.hasOwnProperty('target') ? currentEdge.target : null),
                        (currentEdge.hasOwnProperty('startX') ? currentEdge.startX : null),
                        (currentEdge.hasOwnProperty('startY') ? currentEdge.startY : null),
                        (currentEdge.hasOwnProperty('endX') ? currentEdge.endX : null),
                        (currentEdge.hasOwnProperty('endY') ? currentEdge.endY : null),
                        (currentEdge.hasOwnProperty('condition') ? currentEdge.condition : 'true'),
                        (currentEdge.hasOwnProperty('type') ? currentEdge.type : 'Scheduling'),
                        (currentEdge.hasOwnProperty('delay') ? currentEdge.delay : 1),
                        (currentEdge.hasOwnProperty('priority') ? currentEdge.priority : 5),
                        (currentEdge.hasOwnProperty('parameters') ? currentEdge.parameters : {})
                    )
                );
            }
        }
    }

    private clearERG() {
        this.eventList = [];
        this.edgeList = [];
        this.variableList = [];
    }
}

