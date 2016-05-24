System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var EdgeService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            EdgeService = (function () {
                function EdgeService() {
                    this.radToDeg = 180 / Math.PI;
                }
                EdgeService.prototype.getLengthFromEdge = function (edge) {
                    var dx = parseInt(edge.endX) - parseInt(edge.startX);
                    var dy = parseInt(edge.endY) - parseInt(edge.startY);
                    return (Math.sqrt(dx * dx + dy * dy) - 37) + 'px';
                };
                EdgeService.prototype.getLengthFromCoordinates = function (startX, startY, endX, endY) {
                    var dx = parseInt(endX) - parseInt(startX);
                    var dy = parseInt(endY) - parseInt(startY);
                    return (Math.sqrt(dx * dx + dy * dy) - 37) + 'px';
                };
                EdgeService.prototype.getAngleFromCoordinates = function (startX, startY, endX, endY) {
                    var dx = parseInt(endX) - parseInt(startX);
                    var dy = parseInt(endY) - parseInt(startY);
                    return (Math.atan2(dy, dx) * this.radToDeg).toFixed(2) + 'deg';
                };
                EdgeService.prototype.getAngleFromEdge = function (edge) {
                    var dx = parseInt(edge.endX) - parseInt(edge.startX);
                    var dy = parseInt(edge.endY) - parseInt(edge.startY);
                    return (Math.atan2(dy, dx) * this.radToDeg).toFixed(2) + 'deg';
                };
                EdgeService.prototype.twoWayEdge = function (edge, edgeList) {
                    var source = edge.source;
                    var target = edge.target;
                    if (source == target)
                        return false;
                    for (var i = 0; i < edgeList.length; i++) {
                        var currentEdge = edgeList[i];
                        if (source == currentEdge.target && target == currentEdge.source)
                            return true;
                    }
                    return false;
                };
                // only called if pair exists
                EdgeService.prototype.getEdgePair = function (edge, edgeList) {
                    var source = edge.source;
                    var target = edge.target;
                    for (var i = 0; i < edgeList.length; i++) {
                        var currentEdge = edgeList[i];
                        if (source == currentEdge.target && target == currentEdge.source)
                            return currentEdge;
                    }
                };
                EdgeService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], EdgeService);
                return EdgeService;
            }());
            exports_1("EdgeService", EdgeService);
        }
    }
});
//# sourceMappingURL=tao.edge.service.js.map