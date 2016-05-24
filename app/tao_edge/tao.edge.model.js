System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Edge;
    return {
        setters:[],
        execute: function() {
            Edge = (function () {
                function Edge(source, target, startX, startY, endX, endY, condition, type, delay, priority, parameters) {
                    this.source = source;
                    this.target = target;
                    this.startX = startX;
                    this.startY = startY;
                    this.endX = endX;
                    this.endY = endY;
                    this.condition = condition;
                    this.type = type;
                    this.delay = delay;
                    this.priority = priority;
                    this.parameters = parameters;
                }
                Edge.prototype.getSourceEvent = function (eventList) {
                    for (var event in eventList) {
                        if (eventList[event].name === this.source)
                            return eventList[event];
                    }
                    return null;
                };
                Edge.prototype.getTargetEvent = function (eventList) {
                    for (var event in eventList) {
                        if (eventList[event].name === this.target)
                            return eventList[event];
                    }
                    return null;
                };
                Edge.prototype.getCopies = function (edgeList) {
                    var listOfCopies = [];
                    for (var edge in edgeList) {
                        var currentEdge = edgeList[edge];
                        if (currentEdge.source == this.source && currentEdge.target == this.target)
                            listOfCopies.push(currentEdge);
                    }
                    return listOfCopies;
                };
                return Edge;
            }());
            exports_1("Edge", Edge);
        }
    }
});
//# sourceMappingURL=tao.edge.model.js.map