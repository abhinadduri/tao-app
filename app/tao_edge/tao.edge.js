System.register(['@angular/core', '@angular/common', './tao.edge.service'], function(exports_1, context_1) {
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
    var core_1, common_1, tao_edge_service_1;
    var TaoEdge;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (tao_edge_service_1_1) {
                tao_edge_service_1 = tao_edge_service_1_1;
            }],
        execute: function() {
            TaoEdge = (function () {
                function TaoEdge(edgeService) {
                    this.edgeService = edgeService;
                }
                TaoEdge.prototype.getLength = function () {
                    return this.edgeService.getLengthFromEdge(this.tao_edge);
                };
                TaoEdge.prototype.getAngle = function () {
                    return this.edgeService.getAngleFromEdge(this.tao_edge);
                };
                TaoEdge.prototype.twoWayEdge = function () {
                    return this.edgeService.twoWayEdge(this.tao_edge, this.edgeList);
                };
                TaoEdge.prototype.getEdgePair = function () {
                    return this.edgeService.getEdgePair(this.tao_edge, this.edgeList);
                };
                TaoEdge.prototype.calculateDisplacement = function () {
                    var otherEdge = this.getEdgePair();
                    if (this.edgeList.indexOf(this.tao_edge) > this.edgeList.indexOf(otherEdge))
                        return 3;
                    else
                        return -3;
                };
                TaoEdge.prototype.parse = function (x) {
                    return parseInt(x);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoEdge.prototype, "tao_edge", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoEdge.prototype, "selected", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoEdge.prototype, "edgeList", void 0);
                TaoEdge = __decorate([
                    core_1.Component({
                        selector: 'edge',
                        templateUrl: './app/tao_edge/tao.edge.tpl.html',
                        directives: [common_1.NgStyle, common_1.NgClass]
                    }), 
                    __metadata('design:paramtypes', [tao_edge_service_1.EdgeService])
                ], TaoEdge);
                return TaoEdge;
            }());
            exports_1("TaoEdge", TaoEdge);
        }
    }
});
//# sourceMappingURL=tao.edge.js.map