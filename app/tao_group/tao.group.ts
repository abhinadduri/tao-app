/**
 * Created by abhinadduri on 7/10/16.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgStyle} from '@angular/common';
import {Group} from './tao.group.model';

@Component({
    selector: 'group',
    template: `
    <div class="group"
    #group
    *ngIf="tao_group.visible"
    [ngStyle]="{'top': tao_group.y + 'px',
    'left': tao_group.x + 'px'}"
    [ngClass]="{'selectedNode': selected}"
    (mousemove)="handleMouseMove($event, group)"
    (mousedown)="handleMouseDown($event, group)"
    (mouseup)="handleMouseUp($event, group)"
    (click)="selectGroup($event, tao_group)">
    <span>{{tao_group.name}}</span>
    </div>
    `,
    directives: [NgStyle]
})

export class TaoGroup {
    @Input() tao_group: Group;
    @Input() selected: boolean;

    @Output() dragGroup = new EventEmitter();
    @Output() click = new EventEmitter();

    dragFinish = false;
    mousedown = false;
    startX = 0; startY = 0; x = 0; y = 0;

    handleMouseMove(event, group) {
        event.preventDefault();

        if (this.mousedown) {
            this.dragFinish = true;

            this.y = event.pageY - this.startY;
            this.x = event.pageX - this.startX;

            this.tao_group.y = this.y.toString();
            this.tao_group.x = this.x.toString();
            this.dragGroup.emit(this.tao_group);
        }

    }

    handleMouseDown(event, group) {
        event.preventDefault();
        this.startX = event.pageX - parseInt(this.tao_group.x);
        this.startY = event.pageY - parseInt(this.tao_group.y);
        this.mousedown = true;

    }

    handleMouseUp(event, group) {
        event.preventDefault();

        this.mousedown = false;
        this.dragFinish = false;
    }

    selectGroup(event, group) {
        event.preventDefault();
        this.click.emit(this.tao_group);
    }
}