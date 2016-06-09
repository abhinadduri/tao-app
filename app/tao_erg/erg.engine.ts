import {Heap} from './../resources/heap';
import * as _ from 'underscore';

class EngineEvent {
    constructor(
        public name: string,
        public parentEvent: any,
        private id: number,
        public count: number,
        public timestamp: number,
        public priority: number,
        public func: any,
        public params: any,
        public trace: any
    ) { }

    getId() {
        return this.id;
    }
}

class EnginePendingEvent {
    constructor(
        public name: string,
        public parentEvent: any,
        private id: number,
        public count: number,
        public timestamp: number,
        public priority: number,
        public func: any,
        public params: any,
        public trace: any,
        public condition: boolean,
        public conditionFunc: any
    ) { }

    getId() {
        return this.id;
    }
}

class EngineCancellingEvent {
    constructor(
        public name: string,
        public parentEvent: any
    ) { }
}

function lifoRank(e1: EngineEvent, e2: EngineEvent) {
    if (e1.count == e2.count) return 0;

    // Defaults to LIFO
    let result = (e1.count > e2.count) ? -1 : 1;
    if (e1.timestamp == e2.timestamp) {
        if (e1.priority != e2.priority) {
            result = (e1.priority < e2.priority) ? -1 : 1;
        }
    } else {
        result = (e1.timestamp < e2.timestamp) ? -1 : 1;
    }

    return result;
}

class Scheduler {
    clock: number;
    count: number;
    terminate: boolean;

    uniqueId: any;

    scheduledEvents: any;
    pendingEvents: EnginePendingEvent[];
    cancellingEvents: EngineCancellingEvent[];

    constructor(
        public eventRanker: any,
        public duration: number
    ) {
        this.clock = 0;
        this.count = 0;
        this.terminate = false;

        this.uniqueId = {};

        this.scheduledEvents = new Heap(eventRanker);
        this.pendingEvents = [];
        this.cancellingEvents = [];
        this.duration = duration;
    }

    getClock() : number {
        return this.clock;
    }

    setClock(time: number) {
        this.clock = time;
    }

    getCount() : number {
        return this.count;
    }

    terminateSimulation() {
        this.terminate = true;
    }

    schedule(name: string,
             parentEvent: any,
             offset: number,
             priority: number,
             func: any,
             params: any,
             trace: boolean) {
        if (!this.uniqueId.hasOwnProperty(name)) {
            this.uniqueId[name] = 0;
        } else {
            this.uniqueId[name] += 1;
        }

        let futureEvent = new EngineEvent(name, parentEvent, this.uniqueId[name], this.count, this.clock + offset, priority, func, params, trace);
        this.scheduledEvents.push(futureEvent);
        this.count += 1;
    }

    schedulePending(name: string,
                    parentEvent: any,
                    offset: number,
                    priority: number,
                    func: any,
                    params: any,
                    trace: boolean,
                    condition: any,
                    conditionFunc: any) {

        if (!this.uniqueId.hasOwnProperty(name))
            this.uniqueId[name] = 0;
        else
            this.uniqueId[name] += 1;

        let futureEvent = new EnginePendingEvent(name, parentEvent, this.uniqueId[name], this.count, this.clock + offset, priority, func, params, trace, condition, conditionFunc);
        this.pendingEvents.push(futureEvent);
        this.count += 1;
    }

    scheduleCancelling(name: string,
                       parentEvent: any) {

        let cancelOneEvent = new EngineCancellingEvent(name, parentEvent);
        this.cancellingEvents.push(cancelOneEvent);
    }

    hasNext() {
        if (!this.terminate) {
            return !this.scheduledEvents.empty();
        } else {
            return false;
        }
    }

    next() {
        var currentEvent = this.scheduledEvents.pop();
        if (currentEvent)
            this.clock = currentEvent.timestamp;

        return currentEvent;
    }
}

export class Engine {
    public eventRanker: any;
    constructor() {
        this.eventRanker = lifoRank;
    }

    step(scenario: any, duration: number, schedulers: Scheduler[], thread: number, names: string[], graphData: any): number {
        let scheduler = schedulers[thread];
        let success = false;
        if (scheduler.hasNext() || !_.isEmpty(scheduler.pendingEvents)) {
            let currentEvent = scheduler.next();
            let skip = false;
            if (!currentEvent) {
                scheduler.setClock(scheduler.getClock() + 1);
                if (scheduler.getClock() > duration)
                    return -1;
            }

            // check cancelling edges
            for (let e in scheduler.cancellingEvents) {
                let cancel = scheduler.cancellingEvents[e];
                if (cancel.name == currentEvent.name) {
                    delete scheduler.cancellingEvents[e];
                    return 0;
                }
            }

            if (currentEvent.timestamp > duration) return -1;

            currentEvent.func(scheduler, currentEvent.params, false);

            if (currentEvent.parentEvent.name == "Run" && currentEvent.trace)
                console.log(currentEvent.name + ' ' + currentEvent.getId() + ' by Run at time '
                    + scheduler.getClock()
                    + ' by thread ' + (thread + 1));
            else if (currentEvent.parentEvent && currentEvent.trace) {
                console.log(currentEvent.name + ' '
                    + currentEvent.getId() + ' by '
                    + currentEvent.parentEvent.name + ' '
                    + currentEvent.parentEvent.getId() + ' at time '
                    + scheduler.getClock()
                    + ' by thread ' + (thread + 1));
            }

            for (let e in scheduler.pendingEvents) {
                let pendingEvent = scheduler.pendingEvents[e];

                // only global variables

                if (pendingEvent.conditionFunc(scenario)) {
                    delete scheduler.pendingEvents[e];

                    pendingEvent.func(scheduler, pendingEvent.params, true);
                    if (pendingEvent.parentEvent.name == "Run" && pendingEvent.trace)
                        console.log(pendingEvent.name + ' ' + pendingEvent.getId() + ' by Run at time '
                            + scheduler.getClock()
                            + ' by thread ' + (thread + 1));
                    else if (pendingEvent.parentEvent && pendingEvent.trace) {
                        console.log(pendingEvent.name + ' '
                            + pendingEvent.getId() + ' by '
                            + pendingEvent.parentEvent.name + ' '
                            + pendingEvent.parentEvent.getId() + ' at time '
                            + scheduler.getClock()
                            + ' by thread ' + (thread + 1));
                    }

                }
            }

            for (let i = 0; i < names.length; i++) {
                graphData[thread][names[i]][scheduler.getClock()] = scenario[names[i]];
            }

            return 1;
        } else return -2;

    }

    execute(scenarioList: any[], duration: number, threads: number=1, variableNames: string[]): any {

        if (scenarioList.length != threads) {
            alert('Error. Please report this error.');
        }

        let schedulerMaster: Scheduler[] = [];
        let loopMaster: any = {};
        let numberOfEvents: number[] = [];
        let updateMaster: number[] = [];
        let graphData: any = [];

        for (let i = 0; i < threads; i++) {
            schedulerMaster.push(new Scheduler(this.eventRanker, duration));
            loopMaster[i] = 1;
            updateMaster.push(1);
            numberOfEvents.push(0);

            let variables = {};
            for (let j = 0; j < variableNames.length; j++) {
                variables[variableNames[j]] = {};
            }
            graphData.push(variables);
        }

        
        for (let j = 0; j < threads; j++) {
            scenarioList[j].Run(schedulerMaster[j]);
            console.log('Running ' + scenarioList[j].name + ' on thread ' + (j + 1));
        }

        while (!_.isEmpty(loopMaster)) {
            for (let k in loopMaster) {
                for (let j = 0; j < updateMaster[k]; j++) {
                    if (loopMaster[k] == 1) {
                        let status = this.step(scenarioList[k], duration, schedulerMaster, parseInt(k), variableNames, graphData);
                        numberOfEvents[k]++;
                        loopMaster[k] == status;
                        if (status == -1 || status == -2) {
                            delete loopMaster[k]
                            console.log('Terminating thread ' + (parseInt(k)+1));
                            break;
                        }
                    }
                }
            }
            if (threads > 1)
               this.updateResources(numberOfEvents, updateMaster);
        }

        return graphData;

    }

    updateResources(numberOfEvents: number[], updateMaster: number[]) {
        let probabilities = [];
        let sum = 0;
        for (let i = 0; i < numberOfEvents.length; i++) {
            sum += numberOfEvents[i];
        }

        for (let j = 0; j < numberOfEvents.length; j++) {
            probabilities.push(numberOfEvents[j]/sum)
        }
        probabilities.sort();
        let variate = Math.random();
        let cumulativeProbability = 0;
        if (variate < probabilities[0])
            updateMaster[0] += 1;
        else {
            for (let k = 0; k < probabilities.length; k++) {
                cumulativeProbability += probabilities[k];
                if (variate < cumulativeProbability)
                    updateMaster[k] += 1;
            }
        }
    }

}