import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgStyle, NgClass} from '@angular/common';

@Component({
  selector: 'event',
  templateUrl: './app/tao_event/tao.event.tpl.html',
  directives: [NgStyle, NgClass]
})

export class TaoEvent {
    @Input() tao_event;
    @Input() selected;
    @Input() shiftSelected;
    
    @Output() drag = new EventEmitter();
    @Output() historyUpdate = new EventEmitter();
    mousedown = false;
    shiftClick = false;
    dragFinish = false;

    startX = 0; startY = 0; x = 0; y = 0;

    handleSpanClick(domElement) {

    }

    handleOnClick(event, node) {

    }

    handleShiftClick(event, node) {

    }

    handleMouseMove(event, node) {
        event.preventDefault();

        if (this.mousedown) {
            this.dragFinish = true;

            this.y = event.pageY - this.startY;
            this.x = event.pageX - this.startX;

            this.tao_event.y = this.y.toString();
            this.tao_event.x = this.x.toString();
            this.drag.emit({tao_event: this.tao_event, window_event: event});
        }

    }

    handleMouseDown(event, node) {
        event.preventDefault();
        this.startX = event.pageX - parseInt(this.tao_event.x);
        this.startY = event.pageY - parseInt(this.tao_event.y);
        this.mousedown = true;

    }

    handleMouseUp(event, node) {
        event.preventDefault();

        this.mousedown = false;
        if (this.dragFinish)
            this.historyUpdate.emit(0);
        this.dragFinish = false;
    }
}


