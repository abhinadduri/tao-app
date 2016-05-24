System.register(['@angular/core', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var TaoEvent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            TaoEvent = (function () {
                function TaoEvent() {
                    this.drag = new core_1.EventEmitter();
                    this.mousedown = false;
                    this.shiftClick = false;
                    // move this to erg
                    this.startX = 0;
                    this.startY = 0;
                    this.x = 0;
                    this.y = 0;
                }
                TaoEvent.prototype.handleSpanClick = function (domElement) {
                };
                TaoEvent.prototype.handleOnClick = function (event, node) {
                };
                TaoEvent.prototype.handleShiftClick = function (event, node) {
                };
                TaoEvent.prototype.handleMouseMove = function (event, node) {
                    event.preventDefault();
                    if (this.mousedown) {
                        this.y = event.pageY - this.startY;
                        this.x = event.pageX - this.startX;
                        this.tao_event.y = this.y.toString();
                        this.tao_event.x = this.x.toString();
                        this.drag.emit(this.tao_event);
                    }
                };
                TaoEvent.prototype.handleMouseDown = function (event, node) {
                    event.preventDefault();
                    this.startX = event.pageX - parseInt(this.tao_event.x);
                    this.startY = event.pageY - parseInt(this.tao_event.y);
                    this.mousedown = true;
                };
                TaoEvent.prototype.handleMouseUp = function (event, node) {
                    event.preventDefault();
                    this.mousedown = false;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoEvent.prototype, "tao_event", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoEvent.prototype, "selected", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TaoEvent.prototype, "shiftSelected", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaoEvent.prototype, "drag", void 0);
                TaoEvent = __decorate([
                    core_1.Component({
                        selector: 'event',
                        templateUrl: './app/tao_event/tao.event.tpl.html',
                        directives: [common_1.NgStyle, common_1.NgClass]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TaoEvent);
                return TaoEvent;
            }());
            exports_1("TaoEvent", TaoEvent);
        }
    }
});
//# sourceMappingURL=tao.event.js.map