System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Event;
    return {
        setters:[],
        execute: function() {
            /**
             * Created by abhinadduri on 4/24/16.
             */
            Event = (function () {
                function Event(name, stateChange, x, y, trace, parameters) {
                    this.name = name;
                    this.stateChange = stateChange;
                    this.x = x;
                    this.y = y;
                    this.trace = trace;
                    this.parameters = parameters;
                }
                return Event;
            }());
            exports_1("Event", Event);
        }
    }
});
//# sourceMappingURL=tao.event.model.js.map