System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Variable;
    return {
        setters:[],
        execute: function() {
            /**
             * Created by abhinadduri on 4/29/16.
             */
            Variable = (function () {
                function Variable(name, value, description) {
                    this.name = name;
                    this.value = value;
                    this.description = description;
                }
                return Variable;
            }());
            exports_1("Variable", Variable);
        }
    }
});
//# sourceMappingURL=tao.variable.model.js.map