import {Heap} from './../resources/heap';
import * as _ from 'underscore';

enum EngineStatus {
    ERROR = -2,
    TERMINATE = -1,
    CANCELLED = 0,
    CONTINUE = 1
}

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
        public delay: number,
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
        public parentEvent: any,
        public params: any,
        public cancelCondition: any,
        public delay: number
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
    numberOfCancelled: any;

    terminate: boolean;

    uniqueId: any;

    scheduledEvents: any;
    pendingEvents: EnginePendingEvent[];
    cancellingEvents: EngineCancellingEvent[];
    cancelledDelays: any[];

    constructor(
        public eventRanker: any,
        public duration: number
    ) {
        this.clock = 0;
        this.count = 0;
        this.numberOfCancelled = {};
        this.terminate = false;

        this.uniqueId = {};

        this.scheduledEvents = new Heap(eventRanker);
        this.pendingEvents = [];
        this.cancellingEvents = [];
        this.cancelledDelays = [];
        this.duration = duration;
    }

    getClock(): number {
        return this.clock;
    }

    setClock(time: number) {
        this.clock = time;
    }

    getCount(): number {
        return this.count;
    }

    getNumberOfCancelled(name: string): number {
        return this.numberOfCancelled[name];
    }

    getNumberOfScheduled(name: string): number {
        return this.uniqueId[name];
    }

    incrementCancelledNumber(name: string) {
        if (this.numberOfCancelled.hasOwnProperty(name))
            this.numberOfCancelled[name] += 1;
        else
            this.numberOfCancelled[name] = 1;
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
            this.uniqueId[name] = 1;
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

        let futureEvent = new EnginePendingEvent(name, parentEvent, this.uniqueId[name], this.count, offset, priority, func, params, trace, condition, conditionFunc);
        this.pendingEvents.push(futureEvent);
        this.count += 1;
    }

    scheduleCancelling(name: string,
                       parentEvent: any,
                       params: any,
                       cancelFunc: any,
                       delay: number) {

        let cancelOneEvent = new EngineCancellingEvent(name, parentEvent, params, cancelFunc, delay);
        this.cancellingEvents.push(cancelOneEvent);
    }

    scheduleDelay(delay: number,
                  name: string) {
        this.cancelledDelays.push({'delay': delay, 'name': name, 'mark': true, 'time': false});
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

    private log(currentEvent, scheduler, thread) {
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
    }

    step(scenario: any, duration: number, schedulers: Scheduler[], thread: number, names: string[], graphData: any): number {
        let scheduler = schedulers[thread];
        let success = false;
        if (scheduler.hasNext() || !_.isEmpty(scheduler.pendingEvents)) {
            let oldTime: number = scheduler.getClock();
            let currentEvent = scheduler.next();
            if (currentEvent) {
                // check cancelling edges
                for (let e in scheduler.cancellingEvents) {
                    let cancel = scheduler.cancellingEvents[e];
                    let params = cancel.params;
                    if (cancel.name == currentEvent.name) {
                        if (cancel.cancelCondition(scenario)) {
                            scheduler.incrementCancelledNumber(cancel.name);
                            scheduler.scheduleDelay(cancel.delay, cancel.name);
                        }
                        delete scheduler.cancellingEvents[e];
                    }
                }

                for (let c in scheduler.cancelledDelays) {
                    let del = scheduler.cancelledDelays[c];
                    del.delay += (oldTime - scheduler.getClock());
                    if (del.delay <= 0) {
                        if (del.mark) {
                            del.time = scheduler.getClock();
                            del.mark = false;
                        }
                        if (currentEvent.name == del.name) {
                            return EngineStatus.CANCELLED;
                        }
                        if (del.time != scheduler.getClock() && del.mark)
                            delete scheduler.cancelledDelays[c];
                    }
                }

                if (currentEvent.timestamp > duration) return EngineStatus.TERMINATE;

                currentEvent.func(scheduler, currentEvent.params);
                this.log(currentEvent, scheduler, thread);

            }

            for (let e in scheduler.pendingEvents) {
                let pendingEvent = scheduler.pendingEvents[e];
                let params = pendingEvent.params;

                if (pendingEvent.conditionFunc(scenario)) {
                    delete scheduler.pendingEvents[e];

                    scheduler.schedule(pendingEvent.name,
                        pendingEvent.parentEvent,
                        pendingEvent.delay,
                        pendingEvent.priority,
                        pendingEvent.func,
                        pendingEvent.params,
                        pendingEvent.trace);
                };
            }

            for (let i = 0; i < names.length; i++) {
                graphData[thread][names[i]][scheduler.getClock()] = scenario[names[i]];
            }

            if (!currentEvent && !scheduler.hasNext()) {
                scheduler.setClock(scheduler.getClock() + 1);
                if (scheduler.getClock() > duration)
                    return EngineStatus.TERMINATE;
            }

            return EngineStatus.CONTINUE;
        } else  {
            return EngineStatus.ERROR;
        }

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
        let winner: boolean = true;

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
        }

        while (!_.isEmpty(loopMaster)) {
            for (let k in loopMaster) {
                for (let j = 0; j < updateMaster[k]; j++) {
                    if (loopMaster[k] == 1) {
                        let status = this.step(scenarioList[k], duration, schedulerMaster, parseInt(k), variableNames, graphData);
                        numberOfEvents[k]++;
                        loopMaster[k] == status;
                        if (status == EngineStatus.TERMINATE || status == EngineStatus.ERROR) {
                            delete loopMaster[k];
                            console.log('Terminating thread ' + (parseInt(k)+1));
                            if (threads > 1 && winner) {
                                let term = confirm('Thread (' + (parseInt(k) + 1) + ') has finished. Continue running simulation?');
                                winner = false;

                                if (term == false)
                                    return graphData;

                            }
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