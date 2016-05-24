System.register(["handlebars"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Handlebars;
    var ErgTemplate;
    return {
        setters:[
            function (Handlebars_1) {
                Handlebars = Handlebars_1;
            }],
        execute: function() {
            ErgTemplate = (function () {
                function ErgTemplate() {
                }
                ErgTemplate.makeTemplate = function (simulation) {
                    var template = "\n        function {{name}} () {\n          var self = this;\n          var globals = this;\n          console.log('Running: {{name}}');\n          \n          {{! variables}}\n          \n          {{~#each variables}}\n          globals.{{name}} = {{{value}}};\n          {{~/each}}\n          \n          {{! functions}}\n        \n          {{#each events}}\n          self.{{name}} = function(scheduler, params, scheduledByPending) {\n            this.name = \"{{name}}\";\n        \n            {{{stateChange}}}\n            {{#getSchedulingEdges ../edges name}}\n            if ({{{condition}}}) {\n              scheduler.schedule(\"{{#getEvent ../../events target}}{{name}}{{/getEvent}}\", \n              this, \n              {{delay}}, \n              {{priority}}, \n              self.{{#getEvent ../../events target}}{{name}}{{/getEvent}}, \n              {{#parameters parameters}}{{{params}}}{{/parameters}}, \n              {{#getEvent ../../events target}}{{trace}}{{/getEvent}});\n            }\n            {{/getSchedulingEdges}}\n        \n            {{#getPendingEdges ../edges name}}\n            scheduler.schedulePending(\"{{#getEvent ../../events target}}{{name}}{{/getEvent}}\", \n            this, \n            {{delay}}, \n            {{priority}}, \n            self.{{#getEvent ../../events target}}{{name}}{{/getEvent}}, \n            {{#parameters parameters}}{{{params}}}{{/parameters}}, \n            {{#getEvent ../../events target}}{{trace}}{{/getEvent}}, \n            \"{{{condition}}}\", \n            function(globals) { return {{{condition}}}; });\n            {{/getPendingEdges}}\n        \n            {{#getCancellingEdges ../edges name}}\n            scheduler.scheduleCancelling(\"{{#getEvent ../../events target}}{{name}}{{/getEvent}}\", this);\n            {{/getCancellingEdges}}\n        \n            // var graph_var = $('#global_vars option:selected').val()\n            // return (graph_var == \"no_graph\") ? null : globals[graph_var]\n          }\n        \n          {{/each}}\n        }\n        ";
                    function stringify(parameters) {
                        var toReturn = "{";
                        for (var key in parameters) {
                            toReturn += key;
                            toReturn += ": ";
                            toReturn += parameters[key];
                            toReturn += ",";
                        }
                        if (toReturn.charAt(toReturn.length - 1) == ",") {
                            toReturn = toReturn.substr(0, toReturn.length - 1);
                        }
                        toReturn += "}";
                        return toReturn;
                    }
                    function getObjects(obj, key, val) {
                        var newObj = [];
                        for (var i = 0; i < obj.length; i++) {
                            var testObject = obj[i];
                            for (var k in testObject) {
                                if (k == key && testObject[k] == val)
                                    newObj.push(testObject);
                            }
                        }
                        return (newObj);
                    }
                    Handlebars.registerHelper('parameters', function (parameters, options) {
                        if (parameters) {
                            return options.fn({
                                'params': stringify(parameters)
                            });
                        }
                        else {
                            return options.fn({
                                'params': '{}'
                            });
                        }
                    });
                    Handlebars.registerHelper('getSchedulingEdges', function (edges, eventName, options) {
                        var correctEdges = getObjects(edges, "source", eventName);
                        var out = "";
                        for (var i = 0; i < correctEdges.length; i++) {
                            if (correctEdges[i].type == "Scheduling")
                                out += options.fn(correctEdges[i]);
                        }
                        return out;
                    });
                    Handlebars.registerHelper('getPendingEdges', function (edges, eventName, options) {
                        var correctEdges = getObjects(edges, "source", eventName);
                        var out = "";
                        for (var i = 0; i < correctEdges.length; i++) {
                            if (correctEdges[i].type == "Pending")
                                out += options.fn(correctEdges[i]);
                        }
                        return out;
                    });
                    Handlebars.registerHelper('getCancellingEdges', function (edges, eventName, options) {
                        var correctEdges = getObjects(edges, "source", eventName);
                        var out = "";
                        for (var i = 0; i < correctEdges.length; i++) {
                            if (correctEdges[i].type == "Cancelling")
                                out += options.fn(correctEdges[i]);
                        }
                        return out;
                    });
                    Handlebars.registerHelper('pendingEdgeLength', function (edges, eventName, options) {
                        var correctEdges = getObjects(edges, "source", eventName);
                        var list = [];
                        for (var i = 0; i < correctEdges.length; i++) {
                            if (correctEdges[i].edgeType == "Pending")
                                list.push(options.fn(correctEdges[i]));
                        }
                        return options.fn({
                            'length': list.length
                        });
                    });
                    Handlebars.registerHelper('getEvent', function (events, targetEventName, options) {
                        var correctEvent = getObjects(events, "name", targetEventName);
                        return options.fn(correctEvent[0]);
                    });
                    Handlebars.registerHelper('variableEach', function (context, options) {
                        var fn = options.fn, inverse = options.inverse, ctx;
                        var ret = "";
                        if (context && context.length > 0) {
                            for (var i = 0, j = context.length; i < j; i++) {
                                ctx = Object.create(context[i]);
                                ctx.index = i + 1;
                                if (i + 1 == j) {
                                    ctx.last = true;
                                }
                                ret = ret + fn(ctx);
                            }
                        }
                        else {
                            //noinspection TypeScriptValidateTypes
                            ret = inverse(this);
                        }
                        return ret;
                    });
                    var t = Handlebars.compile(template);
                    var rendered = t(simulation);
                    return rendered;
                };
                return ErgTemplate;
            }());
            exports_1("ErgTemplate", ErgTemplate);
        }
    }
});
//# sourceMappingURL=erg.template.js.map