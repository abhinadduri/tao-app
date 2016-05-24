/**
 * Created by abhinadduri on 4/30/16.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgStyle} from '@angular/common';
import {Variable} from "../tao_variable/tao.variable.model";

@Component({
    selector: 'VariablePanel',
    templateUrl: './app/tao_sidebar/tao.variable.panel.tpl.html',
    directives: [NgStyle]
})

export class TaoVariablePanel {
    @Input() selected;
    @Input() simulationName;
    @Input() simulationDescription;
    @Input() timeUnits;
    @Input() variableList;

    @Output() changeName = new EventEmitter();
    @Output() changeDescription = new EventEmitter();
    @Output() changeTime = new EventEmitter();

    updateSimulationName(newName) {
        this.changeName.emit(newName.value);
        // this.simulationName = newName.value;
    }

    updateSimulationDescription(newDescription) {
        this.changeDescription.emit(newDescription.value);
        // this.simulationDescription = newDescription.value;
    }

    updateTimeUnits(newTime) {
        this.changeTime.emit(parseInt(newTime.value));
        // this.timeUnits = parseInt(newTime.value);
        // emit to update properly
    }

    updateVariableValue(newValue, variable) {
        variable.value = newValue.value;
    }

    updateVariableDescription(newDescription, variable) {
        variable.description = newDescription.value;
    }

    changeGraphingVariable() {

    }

    deleteGlobalVariable(variable: Variable) {
        for (var i = 0; i < this.variableList.length; i++) {
            if (variable == this.variableList[i])
                this.variableList.splice(i, 1);
        }

    }

    isEmpty() {
        return this.variableList.length == 0;
    }

    addVariable(variableText) {
        this.variableList.push(
            new Variable(
            variableText.value,
            "0",
            "A new global variable."
        ));
        variableText.value = "";
    }


    
}