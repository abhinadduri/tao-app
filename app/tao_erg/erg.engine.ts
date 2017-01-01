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
        public conditionFunc: any,
        public endConditionFunc: any
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
        public delay: number,
        public subType: string
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
    executeDelay: any[];
    executeParamsDelay: any;

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
        this.executeDelay = [];
        this.executeParamsDelay = {};
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
                    conditionFunc: any,
                    endConditionFunc: any) {

        let futureEvent = new EnginePendingEvent(name, parentEvent, this.uniqueId[name], this.count, offset, priority, func, params, trace, condition, conditionFunc, endConditionFunc);
        this.pendingEvents.push(futureEvent);
        this.count += 1;
    }

    scheduleCancelling(name: string,
                       parentEvent: any,
                       params: any,
                       cancelFunc: any,
                       delay: number,
                       subType: string) {

        let cancelEvent = new EngineCancellingEvent(name, parentEvent, params, cancelFunc, delay, subType);
        this.cancellingEvents.push(cancelEvent);
    }

    scheduleDelay(delay: number,
                  name: string,
                  type: string,
                  params: any) {
        this.cancelledDelays.push({'delay': delay, 'name': name, 'type': type, 'params': params});
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

    pop() {
        return this.scheduledEvents.pop();
    }

    push(event: EngineEvent) {
        this.scheduledEvents.push(event);
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

    private equals(paramsOne: any, paramsTwo: any): boolean {
        for (let prop in paramsOne) {
            if (paramsTwo.hasOwnProperty(prop) &&
                typeof paramsOne[prop] == typeof paramsTwo[prop] &&
                paramsOne[prop] == paramsTwo[prop] || JSON.stringify(paramsOne[prop]) == JSON.stringify(paramsTwo[prop]))
                continue;
            else return false;
        }
        return true;
    }

    private flushScheduling(event: string, scheduler: Scheduler) {
        let toReAdd: any[] = [];
        while (scheduler.hasNext()) {
            let currentEvent: any = scheduler.pop();
            if (currentEvent.name != event)
                toReAdd.push(currentEvent);
        }

        for (let i = 0; i < toReAdd.length; i++) {
            scheduler.push(toReAdd[i]);
        }
    }

    private flushPending(event: string, scheduler: Scheduler) {
        let pendingEvents = scheduler.pendingEvents;

        for (let e in pendingEvents) {
            if (pendingEvents[e].name == event)
                delete pendingEvents[e];
        }
    }

    private updateCancelled(scheduler: Scheduler, scenario) {
        for (let e in scheduler.cancellingEvents) {
            let cancel: EngineCancellingEvent = scheduler.cancellingEvents[e];
            let params = cancel.params;
            delete scheduler.cancellingEvents[e];

            if (cancel.cancelCondition(scenario)) {
                scheduler.incrementCancelledNumber(cancel.name);
                scheduler.scheduleDelay(cancel.delay, cancel.name, cancel.subType, cancel.params);
            }
        }
    }

    step(scenario: any, duration: number, schedulers: Scheduler[], thread: number, names: string[], graphData: any): number {
        let scheduler = schedulers[thread];
        let success = false;
        if (scheduler.hasNext() || !_.isEmpty(scheduler.pendingEvents)) {
            let oldTime = scheduler.getClock();

            for (let e in scheduler.pendingEvents) {
                let pendingEvent = scheduler.pendingEvents[e];
                let params = pendingEvent.params;

                if (pendingEvent.endConditionFunc(scenario)) {
                    delete scheduler.pendingEvents[e];
                    continue;
                }
                // console.log(pendingEvent.condition);
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

            let currentEvent = scheduler.next();

            if (currentEvent) {
                this.updateCancelled(scheduler, scenario);

                for (let c in scheduler.cancelledDelays) {
                    let del = scheduler.cancelledDelays[c];
                    del.delay += (oldTime - scheduler.getClock());

                    if (del.delay <= 0) {
                        delete scheduler.cancelledDelays[c];
                        if (del.type == "Next") {
                            scheduler.executeDelay.push(del.name);
                        } else if (del.type == "Params") {
                            scheduler.executeParamsDelay[del.name] = del.params;
                        } else if (del.type == "All") {
                            this.flushScheduling(del.name, scheduler);
                            this.flushPending(del.name, scheduler);
                            return EngineStatus.CANCELLED;
                        }
                    }
                }

                let index = scheduler.executeDelay.indexOf(currentEvent.name);
                if (index != -1) {
                    scheduler.executeDelay.splice(index, 1);
                    return EngineStatus.CANCELLED;
                }

                if (scheduler.executeParamsDelay.hasOwnProperty(currentEvent.name)) {
                    if (this.equals(scheduler.executeParamsDelay[currentEvent.name], currentEvent.params)) {
                        // delete if failed or wait?
                        delete scheduler.executeParamsDelay[currentEvent.name];
                        return EngineStatus.CANCELLED;
                    }
                }

                if (currentEvent.timestamp > duration) return EngineStatus.TERMINATE;

                currentEvent.func(scheduler, currentEvent.params);
                this.log(currentEvent, scheduler, thread);

            }


            for (let i = 0; i < names.length; i++) {
                graphData[thread][names[i]][scheduler.getClock()] = scenario[names[i]];
            }

            if (!currentEvent && !scheduler.hasNext()) {
                this.updateCancelled(scheduler, scenario);
                scheduler.setClock(scheduler.getClock() + 1);
                for (let c in scheduler.cancelledDelays) {
                    let del = scheduler.cancelledDelays[c];
                    del.delay -= 1;
                }

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