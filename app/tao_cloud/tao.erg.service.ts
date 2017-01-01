/**
 * Created by abhinadduri on 7/31/16.
 */
import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class currentERG {
    public changeERG: EventEmitter;
    public currentModel: string;
    public edited: boolean;

    constructor() {
        this.changeERG = new EventEmitter();
        this.currentModel = null;
        this.edited = false;
    }

    changeModel(simulation) {
        this.currentModel = simulation;
        this.changeERG.emit(simulation);
        this.edited = false;
    }
}

