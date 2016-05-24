System.register(['./../resources/heap', 'underscore'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var heap_1, _;
    var EngineEvent, EnginePendingEvent, EngineCancellingEvent, Scheduler, Engine;
    function lifoRank(e1, e2) {
        if (e1.count == e2.count)
            return 0;
        // Defaults to LIFO
        var result = (e1.count > e2.count) ? -1 : 1;
        if (e1.timestamp == e2.timestamp) {
            if (e1.priority != e2.priority) {
                result = (e1.priority < e2.priority) ? -1 : 1;
            }
        }
        else {
            result = (e1.timestamp < e2.timestamp) ? -1 : 1;
        }
        return result;
    }
    return {
        setters:[
            function (heap_1_1) {
                heap_1 = heap_1_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            EngineEvent = (function () {
                function EngineEvent(name, parentEvent, id, count, timestamp, priority, func, params, trace) {
                    this.name = name;
                    this.parentEvent = parentEvent;
                    this.id = id;
                    this.count = count;
                    this.timestamp = timestamp;
                    this.priority = priority;
                    this.func = func;
                    this.params = params;
                    this.trace = trace;
                }
                EngineEvent.prototype.getId = function () {
                    return this.id;
                };
                return EngineEvent;
            }());
            EnginePendingEvent = (function () {
                function EnginePendingEvent(name, parentEvent, id, count, timestamp, priority, func, params, trace, condition, conditionFunc) {
                    this.name = name;
                    this.parentEvent = parentEvent;
                    this.id = id;
                    this.count = count;
                    this.timestamp = timestamp;
                    this.priority = priority;
                    this.func = func;
                    this.params = params;
                    this.trace = trace;
                    this.condition = condition;
                    this.conditionFunc = conditionFunc;
                }
                EnginePendingEvent.prototype.getId = function () {
                    return this.id;
                };
                return EnginePendingEvent;
            }());
            EngineCancellingEvent = (function () {
                function EngineCancellingEvent(name, parentEvent) {
                    this.name = name;
                    this.parentEvent = parentEvent;
                }
                return EngineCancellingEvent;
            }());
            Scheduler = (function () {
                function Scheduler(eventRanker, duration) {
                    this.eventRanker = eventRanker;
                    this.duration = duration;
                    this.clock = 0;
                    this.count = 0;
                    this.terminate = false;
                    this.uniqueId = {};
                    this.scheduledEvents = new heap_1.Heap(eventRanker);
                    this.pendingEvents = [];
                    this.cancellingEvents = [];
                    this.duration = duration;
                }
                Scheduler.prototype.getClock = function () {
                    return this.clock;
                };
                Scheduler.prototype.getCount = function () {
                    return this.count;
                };
                Scheduler.prototype.terminateSimulation = function () {
                    this.terminate = true;
                };
                Scheduler.prototype.schedule = function (name, parentEvent, offset, priority, func, params, trace) {
                    if (!this.uniqueId.hasOwnProperty(name)) {
                        this.uniqueId[name] = 0;
                    }
                    else {
                        this.uniqueId[name] += 1;
                    }
                    var futureEvent = new EngineEvent(name, parentEvent, this.uniqueId[name], this.count, this.clock + offset, priority, func, params, trace);
                    this.scheduledEvents.push(futureEvent);
                    this.count += 1;
                };
                Scheduler.prototype.schedulePending = function (name, parentEvent, offset, priority, func, params, trace, condition, conditionFunc) {
                    if (!this.uniqueId.hasOwnProperty(name))
                        this.uniqueId[name] = 0;
                    else
                        this.uniqueId[name] += 1;
                    console.log(name);
                    var futureEvent = new EnginePendingEvent(name, parentEvent, this.uniqueId[name], this.count, this.clock + offset, priority, func, params, trace, condition, conditionFunc);
                    this.pendingEvents.push(futureEvent);
                    this.count += 1;
                };
                Scheduler.prototype.scheduleCancelling = function (name, parentEvent) {
                    var cancelOneEvent = new EngineCancellingEvent(name, parentEvent);
                    this.cancellingEvents.push(cancelOneEvent);
                };
                Scheduler.prototype.hasNext = function () {
                    if (!this.terminate) {
                        return !this.scheduledEvents.empty();
                    }
                    else {
                        return false;
                    }
                };
                Scheduler.prototype.next = function () {
                    var currentEvent = this.scheduledEvents.pop();
                    if (currentEvent)
                        this.clock = currentEvent.timestamp;
                    return currentEvent;
                };
                return Scheduler;
            }());
            Engine = (function () {
                function Engine() {
                    this.eventRanker = lifoRank;
                }
                Engine.prototype.execute = function (scenario, duration) {
                    var scheduler = new Scheduler(this.eventRanker, duration);
                    var graph_data = {};
                    scenario.Run(scheduler);
                    while (scheduler.hasNext() || !_.isEmpty(scheduler.pendingEvents)) {
                        // console.log(scheduler.scheduledEvents.nodes);
                        var currentEvent = scheduler.next();
                        var skip = false;
                        if (currentEvent) {
                            for (var e in scheduler.cancellingEvents) {
                                var event_1 = scheduler.cancellingEvents[e];
                                if (event_1.name == currentEvent.name) {
                                    skip = true;
                                    delete scheduler.cancellingEvents[e];
                                }
                            }
                            if (skip)
                                continue;
                            // console.log(scenario[$('#global_vars option:selected').text()]);
                            var data = 0;
                            if (currentEvent.timestamp > duration)
                                break;
                            data = currentEvent.func(scheduler, currentEvent.params, false);
                            // var color = $('#' + currentEvent.name).css('background')
                            // $('#' + currentEvent.name).css({'background': 'black'})
                            // setTimeout(function() {
                            if (currentEvent.parentEvent.name == "Run") {
                                console.log(currentEvent.name + ' ' + currentEvent.getId() + ' by Run 0');
                            }
                            else if (currentEvent.parentEvent && currentEvent.trace) {
                                console.log(currentEvent.name + ' '
                                    + currentEvent.getId() + ' by '
                                    + currentEvent.parentEvent.name + ' '
                                    + currentEvent.parentEvent.getId() + ' at time '
                                    + scheduler.getClock());
                            }
                        }
                        //pending events
                        for (var e in scheduler.pendingEvents) {
                            var pendingEvent = scheduler.pendingEvents[e];
                            // only global variables
                            if (pendingEvent.conditionFunc(scenario)) {
                                delete scheduler.pendingEvents[e];
                                data = pendingEvent.func(scheduler, pendingEvent.params, true);
                                if (pendingEvent.parentEvent.name == "Run") {
                                    console.log(pendingEvent.name + ' ' + pendingEvent.getId() + ' by Run 0 at time ' + scheduler.getClock());
                                }
                                else if (pendingEvent.parentEvent && pendingEvent.trace) {
                                    console.log(pendingEvent.name + ' '
                                        + pendingEvent.getId() + ' by '
                                        + pendingEvent.parentEvent.name + ' '
                                        + pendingEvent.parentEvent.getId() + ' at time '
                                        + scheduler.getClock());
                                }
                            }
                        }
                    }
                    // return graph_data
                };
                return Engine;
            }());
            exports_1("Engine", Engine);
        }
    }
});
//# sourceMappingURL=erg.engine.js.map