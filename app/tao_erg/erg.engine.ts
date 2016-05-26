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
        console.log(name);
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

    execute(scenario: any, duration: number) {
        let scheduler = new Scheduler(this.eventRanker, duration);
        let graph_data = {};
        // how to deal with pending events only? one time unit per execution?
        // let pendingEventCounter = 0;
        // let pendingEventOccured = false;
        scenario.Run(scheduler);

        while (scheduler.hasNext() || !_.isEmpty(scheduler.pendingEvents)) {
            // console.log(scheduler.scheduledEvents.nodes);
            let currentEvent = scheduler.next();
            let skip = false;

            if (!currentEvent) {
                scheduler.setClock(scheduler.getClock() + 1);
                if (scheduler.getClock() > duration)
                    break;
            } else {
                // cancel pending events?
                for (var e in scheduler.cancellingEvents) {
                    let event = scheduler.cancellingEvents[e];

                    if (event.name == currentEvent.name) {
                        skip = true;
                        delete scheduler.cancellingEvents[e];
                    }
                }

                if (skip)
                    continue;

                // console.log(scenario[$('#global_vars option:selected').text()]);
                var data = 0

                if (currentEvent.timestamp > duration) break;

                data = currentEvent.func(scheduler, currentEvent.params, false);

                // var color = $('#' + currentEvent.name).css('background')
                // $('#' + currentEvent.name).css({'background': 'black'})

                // setTimeout(function() {
                if (currentEvent.parentEvent.name == "Run") {
                    console.log(currentEvent.name + ' ' + currentEvent.getId() + ' by Run 0');
                } else if (currentEvent.parentEvent && currentEvent.trace) {
                    console.log(currentEvent.name + ' '
                        + currentEvent.getId() + ' by '
                        + currentEvent.parentEvent.name + ' '
                        + currentEvent.parentEvent.getId() + ' at time '
                        + scheduler.getClock());
                }
                // $('#' + currentEvent.name).css({'background': color})
                // }, 50)
            }


            //pending events
            for (var e in scheduler.pendingEvents) {
                let pendingEvent = scheduler.pendingEvents[e];

                // only global variables

                if (pendingEvent.conditionFunc(scenario)) {
                    delete scheduler.pendingEvents[e];

                    data = pendingEvent.func(scheduler, pendingEvent.params, true);
                    if (pendingEvent.parentEvent.name == "Run") {
                        console.log(pendingEvent.name + ' ' + pendingEvent.getId() + ' by Run 0 at time ' + scheduler.getClock());
                    } else if (pendingEvent.parentEvent && pendingEvent.trace) {
                        console.log(pendingEvent.name + ' '
                            + pendingEvent.getId() + ' by '
                            + pendingEvent.parentEvent.name + ' '
                            + pendingEvent.parentEvent.getId() + ' at time '
                            + scheduler.getClock());
                    }

                }
            }

            // graph_data[scheduler.getClock()] = data
        }

        // return graph_data

    }
}