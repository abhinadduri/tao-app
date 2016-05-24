System.register(['@angular/core', '@angular/common', "../tao_variable/tao.variable.model"], function(exports_1, context_1) {
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
    var core_1, common_1, tao_variable_model_1;
    var TaoVariablePanel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (tao_variable_model_1_1) {
                tao_variable_model_1 = tao_variable_model_1_1;
            }],
        execute: function() {
            TaoVariablePanel = (function () {
                function TaoVariablePanel() {
                    this.changeName = new core_1.EventEmitter();
                    this.changeDescription = new core_1.EventEmitter();
                    this.changeTime = new core_1.EventEmitter();
                }
                TaoVariablePanel.prototype.updateSimulationName = function (newName) {
                    this.changeName.emit(newName.value);
                    // this.simulationName = newName.value;
                };
                TaoVariablePanel.prototype.updateSimulationDescription = function (newDescription) {
                    this.changeDescription.emit(newDescription.value);
                    // this.simulationDescription = newDescription.value;
                };
                TaoVariablePanel.prototype.updateTimeUnits = function (newTime) {
                    this.changeTime.emit(parseInt(newTime.value));
                    // this.timeUnits = parseInt(newTime.value);
                    // emit to update properly
                };
                TaoVariablePanel.prototype.updateVariableValue = function (newValue, variable) {
                    variable.value = newValue.value;
                };
                TaoVariablePanel.prototype.updateVariableDescription = function (newDescription, variable) {
                    variable.description = newDescription.value;
                };
                TaoVariablePanel.prototype.changeGraphingVariable = function () {
                };
                TaoVariablePanel.prototype.deleteGlobalVariable = function (variable) {
                    for (var i = 0; i < this.variableList.length; i++) {
                        if (variable == this.variableList[i])
                            this.variableList.splice(i, 1);
                    }
                };
                TaoVariablePanel.prototype.isEmpty = function () {
                    return this.variableList.length == 0;
                };
                TaoVariablePanel.prototype.addVariable = function (variableText) {
                    this.variableList.push(new tao_variable_model_1.Variable(variableText.value, "0", "A new global variable."));
                    variableText.value = "";
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "selected", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "simulationName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "simulationDescription", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "timeUnits", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "variableList", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "changeName", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "changeDescription", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoVariablePanel.prototype, "changeTime", void 0);
                TaoVariablePanel = __decorate([
                    core_1.Component({
                        selector: 'VariablePanel',
                        templateUrl: './app/tao_sidebar/tao.variable.panel.tpl.html',
                        directives: [common_1.NgStyle]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TaoVariablePanel);
                return TaoVariablePanel;
            }());
            exports_1("TaoVariablePanel", TaoVariablePanel);
        }
    }
});
//# sourceMappingURL=tao.variable.panel.js.map