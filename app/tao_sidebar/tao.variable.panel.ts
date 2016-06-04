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
    @Input() threads;

    @Output() changeName = new EventEmitter();
    @Output() changeDescription = new EventEmitter();
    @Output() changeTime = new EventEmitter();
    @Output() changeThreadNumber = new EventEmitter();
    @Output() variableHistoryUpdate = new EventEmitter();

    updateSimulationName(newName) {
        this.changeName.emit(newName.value);
    }

    updateSimulationDescription(newDescription) {
        this.changeDescription.emit(newDescription.value);
    }

    updateTimeUnits(newTime) {
        this.changeTime.emit(parseInt(newTime.value));
    }

    updateVariableValue(newValue, variable) {
        let value = eval('(' + newValue.value + ')');
        variable.value = newValue.value;
        this.variableHistoryUpdate.emit(0);
    }

    updateThreadNumber(newValue) {
        this.changeThreadNumber.emit(newValue.value);
    }

    updateVariableDescription(newDescription, variable) {
        variable.description = newDescription.value;
        this.variableHistoryUpdate.emit(0);
    }

    changeGraphingVariable() {

    }

    deleteGlobalVariable(variable: Variable) {
        for (var i = 0; i < this.variableList.length; i++) {
            if (variable == this.variableList[i])
                this.variableList.splice(i, 1);
        }

        this.variableHistoryUpdate.emit(0);
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
        this.variableHistoryUpdate.emit(0);
    }


    
}