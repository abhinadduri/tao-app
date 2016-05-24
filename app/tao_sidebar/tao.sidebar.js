System.register(['@angular/core', '@angular/common', '../tao_event/tao.event.model', '../tao_edge/tao.edge.model', '../tao_sidebar/tao.variable.panel'], function(exports_1, context_1) {
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
    var core_1, common_1, common_2, tao_event_model_1, tao_edge_model_1, tao_variable_panel_1;
    var TaoSidebar;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
                common_2 = common_1_1;
            },
            function (tao_event_model_1_1) {
                tao_event_model_1 = tao_event_model_1_1;
            },
            function (tao_edge_model_1_1) {
                tao_edge_model_1 = tao_edge_model_1_1;
            },
            function (tao_variable_panel_1_1) {
                tao_variable_panel_1 = tao_variable_panel_1_1;
            }],
        execute: function() {
            TaoSidebar = (function () {
                function TaoSidebar() {
                    this.resetParticle = new core_1.EventEmitter();
                    this.downloadERG = new core_1.EventEmitter();
                    this.runERG = new core_1.EventEmitter();
                    this.openERG = new core_1.EventEmitter();
                    this.changeNameERG = new core_1.EventEmitter();
                    this.changeDescriptionERG = new core_1.EventEmitter();
                    this.changeTimeERG = new core_1.EventEmitter();
                    this.emptyDict = {};
                    this.emptyList = [];
                    this.help = false;
                }
                TaoSidebar.prototype.handleDownload = function () {
                    this.downloadERG.emit(0);
                };
                TaoSidebar.prototype.handleRun = function () {
                    this.runERG.emit(0);
                };
                TaoSidebar.prototype.handleOpen = function (file) {
                    this.openERG.emit(file);
                };
                TaoSidebar.prototype.launchHelp = function () {
                    this.selectedParticle = null;
                };
                TaoSidebar.prototype.loadVariablePanel = function () {
                    this.resetParticle.emit(0);
                };
                TaoSidebar.prototype.setEdge = function (edge) {
                    this.selectedParticle = edge;
                };
                TaoSidebar.prototype.tester = function (a) {
                    console.log(a);
                };
                TaoSidebar.prototype.typeOfNode = function () {
                    return (!(this.selectedParticle)) ? false : (this.selectedParticle.constructor == tao_event_model_1.Event);
                };
                TaoSidebar.prototype.typeOfEdge = function () {
                    return (!(this.selectedParticle)) ? false : (this.selectedParticle.constructor == tao_edge_model_1.Edge);
                };
                TaoSidebar.prototype.updateGlobalsPanel = function () {
                };
                TaoSidebar.prototype.updateEvent = function (eventName, trace, stateChange) {
                    this.selectedParticle.name = eventName.value;
                    this.selectedParticle.trace = trace.checked;
                    this.selectedParticle.stateChange = stateChange.value;
                    // console.log(this.selectedParticle.parameters);
                };
                // only called if selected particle is an edge
                TaoSidebar.prototype.updateEdge = function (edgeType, edgeCondition, edgeDelay, edgePriority, edgeParameters) {
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
                };
                TaoSidebar.prototype.keys = function (params) {
                    return Object.keys(params);
                };
                TaoSidebar.prototype.deleteParameterEvent = function (parameter) {
                    // if this function is being called, selectedParticle cannot possibly be null
                    // can change this to only make permanent changes on an update
                    delete this.selectedParticle.parameters[parameter];
                };
                TaoSidebar.prototype.addParameterToEvent = function (param) {
                    // will only be called if selected particle is a node
                    this.selectedParticle.parameters[param.value] = null;
                    param.value = "";
                };
                TaoSidebar.prototype.deleteEvent = function () {
                    if (this.selectedParticle.name == 'Run') {
                        alert('You cannot delete the run node.');
                        return;
                    }
                    for (var i = 0; i < this.edgeList.length; i++) {
                        var currentEdge = this.edgeList[i];
                        if (currentEdge.target == this.selectedParticle.name
                            || currentEdge.source == this.selectedParticle.name) {
                            this.edgeList.splice(i, 1);
                        }
                    }
                    var index = this.eventList.indexOf(this.selectedParticle);
                    this.eventList.splice(index, 1);
                };
                TaoSidebar.prototype.deleteEdge = function () {
                    var index = this.edgeList.indexOf(this.selectedParticle);
                    this.edgeList.splice(index, 1);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "selectedParticle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "eventList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "edgeList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "variableList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], TaoSidebar.prototype, "variablePanel", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], TaoSidebar.prototype, "simulationName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], TaoSidebar.prototype, "simulationDescription", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], TaoSidebar.prototype, "timeUnits", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "resetParticle", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "downloadERG", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "runERG", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "openERG", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "changeNameERG", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "changeDescriptionERG", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoSidebar.prototype, "changeTimeERG", void 0);
                TaoSidebar = __decorate([
                    core_1.Component({
                        selector: 'sidebar',
                        templateUrl: './app/tao_sidebar/tao.sidebar.tpl.html',
                        directives: [common_1.NgStyle, common_2.CORE_DIRECTIVES, tao_variable_panel_1.TaoVariablePanel]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TaoSidebar);
                return TaoSidebar;
            }());
            exports_1("TaoSidebar", TaoSidebar);
        }
    }
});
//# sourceMappingURL=tao.sidebar.js.map