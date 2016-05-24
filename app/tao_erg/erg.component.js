System.register(['@angular/core', './../tao_event/tao.event', './../tao_edge/tao.edge', './../tao_sidebar/tao.sidebar', './../tao_edge/tao.edge.model', './../tao_event/tao.event.model', './../tao_variable/tao.variable.model', './erg.template', './erg.engine'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, tao_event_1, tao_edge_1, tao_sidebar_1, tao_edge_model_1, tao_event_model_1, tao_variable_model_1, erg_template_1, erg_engine_1;
    var ErgComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tao_event_1_1) {
                tao_event_1 = tao_event_1_1;
            },
            function (tao_edge_1_1) {
                tao_edge_1 = tao_edge_1_1;
            },
            function (tao_sidebar_1_1) {
                tao_sidebar_1 = tao_sidebar_1_1;
            },
            function (tao_edge_model_1_1) {
                tao_edge_model_1 = tao_edge_model_1_1;
            },
            function (tao_event_model_1_1) {
                tao_event_model_1 = tao_event_model_1_1;
            },
            function (tao_variable_model_1_1) {
                tao_variable_model_1 = tao_variable_model_1_1;
            },
            function (erg_template_1_1) {
                erg_template_1 = erg_template_1_1;
            },
            function (erg_engine_1_1) {
                erg_engine_1 = erg_engine_1_1;
            }],
        execute: function() {
            ErgComponent = (function () {
                function ErgComponent() {
                }
                ErgComponent.prototype.ngOnInit = function () {
                    this.counter = 1;
                    this.selectedParticle = null;
                    this.shiftSelectedSource = null;
                    this.selectedVariablePanel = false;
                    this.simulationName = "Simulation";
                    this.simulationDescription = "A sample description.";
                    this.timeUnits = 5;
                    this.eventList = [
                        new tao_event_model_1.Event("Run", "// your code here", "50", "50", false, {})
                    ];
                    this.edgeList = [];
                    this.variableList = [];
                };
                ErgComponent.prototype.handleDownload = function () {
                    console.log(JSON.stringify(this.produceErgJSON()));
                };
                ErgComponent.prototype.handleRun = function () {
                    var generatedCode = erg_template_1.ErgTemplate.makeTemplate(this.produceErgJSON());
                    var engine = new erg_engine_1.Engine();
                    var compiledFunction = eval('(' + generatedCode + ')');
                    var codeToRun = new compiledFunction();
                    engine.execute(codeToRun, this.timeUnits);
                };
                ErgComponent.prototype.handleOpen = function (e) {
                    // let file = new FileReader();
                    var file = e.target.files[0];
                    if (!file) {
                        return;
                    }
                    var reader = new FileReader();
                    var self = this;
                    reader.onload = function (e) {
                        var target = e.target;
                        self.loadFromText(target.result);
                    };
                    reader.readAsText(file);
                };
                ErgComponent.prototype.createEvent = function (e, graph) {
                    if (e.target == graph) {
                        var name = "Event" + this.counter;
                        var x = (e.clientX - 35).toString();
                        var y = (e.clientY - 35).toString();
                        var stateChange = "// your code here";
                        var event = new tao_event_model_1.Event(name, stateChange, x, y, true, {});
                        this.counter++;
                        this.eventList.push(event);
                    }
                };
                ErgComponent.prototype.unSelect = function (graph, e) {
                    if (e.target == graph) {
                        this.selectedParticle = null;
                        this.shiftSelectedSource = null;
                        this.selectedVariablePanel = false;
                    }
                };
                ErgComponent.prototype.unSelectFromPanel = function () {
                    this.selectedParticle = null;
                    this.shiftSelectedSource = null;
                    this.selectedVariablePanel = true;
                };
                ErgComponent.prototype.selectEvent = function (event, e) {
                    if (e.shiftKey)
                        this.selectShiftEvent(event, e);
                    else {
                        this.selectedVariablePanel = false;
                        this.selectedParticle = event;
                    }
                };
                ErgComponent.prototype.selectShiftEvent = function (event, e) {
                    if (!this.shiftSelectedSource)
                        this.shiftSelectedSource = event;
                    else if (this.shiftSelectedSource) {
                        // can optimize this maybe
                        this.createEdge(this.shiftSelectedSource.name, event.name);
                        this.shiftSelectedSource = null;
                    }
                };
                ErgComponent.prototype.createEdge = function (source, target) {
                    var sourceEvent = null;
                    var targetEvent = null;
                    for (var i = 0; i < this.eventList.length; i++) {
                        var currentEvent = this.eventList[i];
                        if (currentEvent.name === source)
                            sourceEvent = currentEvent;
                        if (currentEvent.name === target)
                            targetEvent = currentEvent;
                    }
                    var newEdge = new tao_edge_model_1.Edge(source, target, (parseInt(sourceEvent.x) + 35).toString(), (parseInt(sourceEvent.y) + 35).toString(), (parseInt(targetEvent.x) + 35).toString(), (parseInt(targetEvent.y) + 35).toString(), 'true', 'Scheduling', 1, 5, {});
                    this.edgeList.push(newEdge);
                };
                ErgComponent.prototype.selectEdge = function (edge, e) {
                    this.selectedVariablePanel = false;
                    this.selectedParticle = edge;
                };
                // given an event, get all edges whose source/target is that event
                ErgComponent.prototype.getSourceAndTargetEdges = function (node) {
                    var output = { 'source': [], 'target': [] };
                    for (var i = 0; i < this.edgeList.length; i++) {
                        if (this.edgeList[i].source === node.name)
                            output['source'].push(this.edgeList[i]);
                        // fix this for self edges
                        if (this.edgeList[i].target === node.name)
                            output['target'].push(this.edgeList[i]);
                    }
                    return output;
                };
                ErgComponent.prototype.handleDrag = function (node) {
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
                };
                ErgComponent.prototype.produceErgJSON = function () {
                    var simulation = {};
                    simulation['name'] = this.simulationName;
                    simulation['time'] = this.timeUnits;
                    simulation['variables'] = [];
                    for (var i = 0; i < this.variableList.length; i++) {
                        var currentVariable = this.variableList[i];
                        simulation['variables'].push({
                            'name': currentVariable.name,
                            'value': currentVariable.value,
                            'description': currentVariable.description
                        });
                    }
                    simulation['edges'] = [];
                    for (var i = 0; i < this.edgeList.length; i++) {
                        var currentEdge = this.edgeList[i];
                        simulation['edges'].push({
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
                        });
                    }
                    simulation['events'] = [];
                    for (var i = 0; i < this.eventList.length; i++) {
                        var currentEvent = this.eventList[i];
                        simulation['events'].push({
                            'name': currentEvent.name,
                            'stateChange': currentEvent.stateChange,
                            'x': currentEvent.x,
                            'y': currentEvent.y,
                            'trace': currentEvent.trace,
                            'parameters': currentEvent.parameters
                        });
                    }
                    // console.log(simulation);
                    return simulation;
                };
                ErgComponent.prototype.loadFromText = function (simulation) {
                    var simJson = eval('(' + simulation + ')');
                    this.clearERG();
                    this.simulationName = simJson.hasOwnProperty('name') ? simJson.name : 'Simulation';
                    this.timeUnits = simJson.hasOwnProperty('time') ? simJson.time : 10;
                    if (simJson.hasOwnProperty('variables')) {
                        for (var i = 0; i < simJson.variables.length; i++) {
                            var currentVariable = simJson.variables[i];
                            this.variableList.push(new tao_variable_model_1.Variable((currentVariable.hasOwnProperty('name') ? currentVariable.name : 'Variable' + i), (currentVariable.hasOwnProperty('value') ? currentVariable.value : 0), (currentVariable.hasOwnProperty('description') ? currentVariable.description : 'Description')));
                        }
                    }
                    if (simJson.hasOwnProperty('events')) {
                        for (var i = 0; i < simJson.events.length; i++) {
                            var currentEvent = simJson.events[i];
                            this.eventList.push(new tao_event_model_1.Event((currentEvent.hasOwnProperty('name') ? currentEvent.name : 'Event' + i), (currentEvent.hasOwnProperty('stateChange') ? currentEvent.stateChange : '// your code here'), (currentEvent.hasOwnProperty('x') ? currentEvent.x.toString() : (i * 100).toString()), (currentEvent.hasOwnProperty('y') ? currentEvent.y.toString() : (i * 100).toString()), (currentEvent.hasOwnProperty('trace') ? currentEvent.trace : true), (currentEvent.hasOwnProperty('parameters') ? currentEvent.parameters : {})));
                        }
                    }
                    if (simJson.hasOwnProperty('edges')) {
                        for (var i = 0; i < simJson.edges.length; i++) {
                            var currentEdge = simJson.edges[i];
                            this.edgeList.push(new tao_edge_model_1.Edge((currentEdge.hasOwnProperty('source') ? currentEdge.source : null), (currentEdge.hasOwnProperty('target') ? currentEdge.target : null), (currentEdge.hasOwnProperty('startX') ? currentEdge.startX : null), (currentEdge.hasOwnProperty('startY') ? currentEdge.startY : null), (currentEdge.hasOwnProperty('endX') ? currentEdge.endX : null), (currentEdge.hasOwnProperty('endY') ? currentEdge.endY : null), (currentEdge.hasOwnProperty('condition') ? currentEdge.condition : 'true'), (currentEdge.hasOwnProperty('type') ? currentEdge.type : 'Scheduling'), (currentEdge.hasOwnProperty('delay') ? currentEdge.delay : 1), (currentEdge.hasOwnProperty('priority') ? currentEdge.priority : 5), (currentEdge.hasOwnProperty('parameters') ? currentEdge.parameters : {})));
                        }
                    }
                };
                ErgComponent.prototype.clearERG = function () {
                    this.eventList = [];
                    this.edgeList = [];
                    this.variableList = [];
                };
                ErgComponent = __decorate([
                    core_1.Component({
                        selector: 'erg',
                        directives: [tao_event_1.TaoEvent, tao_edge_1.TaoEdge, tao_sidebar_1.TaoSidebar],
                        templateUrl: './app/tao_erg/erg.component.tpl.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], ErgComponent);
                return ErgComponent;
            }());
            exports_1("ErgComponent", ErgComponent);
        }
    }
});
//# sourceMappingURL=erg.component.js.map