import * as Handlebars from 'handlebars'

export class ErgTemplate {

    constructor() {}

    public static makeTemplate(simulation) {
        let template = `
        function {{name}} () {
          var self = this;
          var globals = this;
          var function_lookup = {};
          console.log('Running: {{name}}');
          
          {{! variables}}
          
          {{~#each variables}}
          globals.{{name}} = {{{value}}};
          {{~/each}}
          
          {{! functions}}
        
          {{#each events}}
          
          function_lookup['{{name}}'] = function() { 
          {{{stateChange}}} 
          
          };
          
          self.{{name}} = function(scheduler, params, scheduledByPending) {
            this.name = "{{name}}";
            function_lookup['{{name}}']();
            {{#getSchedulingEdges ../edges name}}
            if ({{{condition}}}) {
              scheduler.schedule("{{#getEvent ../../events target}}{{name}}{{/getEvent}}", 
              this, 
              {{delay}}, 
              {{priority}}, 
              self.{{#getEvent ../../events target}}{{name}}{{/getEvent}}, 
              {{#parameters parameters}}{{{params}}}{{/parameters}}, 
              {{#getEvent ../../events target}}{{trace}}{{/getEvent}});
            }
            {{/getSchedulingEdges}}
        
            {{#getPendingEdges ../edges name}}
            scheduler.schedulePending("{{#getEvent ../../events target}}{{name}}{{/getEvent}}", 
            this, 
            {{delay}}, 
            {{priority}}, 
            self.{{#getEvent ../../events target}}{{name}}{{/getEvent}}, 
            {{#parameters parameters}}{{{params}}}{{/parameters}}, 
            {{#getEvent ../../events target}}{{trace}}{{/getEvent}}, 
            "{{{condition}}}", 
            function(globals) { return {{{condition}}}; });
            {{/getPendingEdges}}
        
            {{#getCancellingEdges ../edges name}}
            scheduler.scheduleCancelling("{{#getEvent ../../events target}}{{name}}{{/getEvent}}", this);
            {{/getCancellingEdges}}
        
            // var graph_var = $('#global_vars option:selected').val()
            // return (graph_var == "no_graph") ? null : globals[graph_var]
          }
        
          {{/each}}
        }
        `;

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
                let testObject = obj[i];

                for (var k in testObject) {
                    if (k == key && testObject[k] == val)
                        newObj.push(testObject);
                }
            }

            return (newObj);
        }

        Handlebars.registerHelper('parameters', function(parameters, options) {
            if (parameters) {
                return options.fn({
                    'params': stringify(parameters)
                })
            } else {
                return options.fn({
                    'params': '{}'
                });
            }
        });

        Handlebars.registerHelper('getSchedulingEdges', function (edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
            var out = "";
            for (var i = 0; i < correctEdges.length; i++) {
                if (correctEdges[i].type == "Scheduling")
                    out += options.fn(correctEdges[i]);
            }
            return out;
        });

        Handlebars.registerHelper('getPendingEdges', function (edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
            var out = "";
            for (var i = 0; i < correctEdges.length; i++) {
                if (correctEdges[i].type == "Pending")
                    out += options.fn(correctEdges[i]);
            }
            return out;
        });

        Handlebars.registerHelper('getCancellingEdges', function(edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
            var out = "";
            for (var i = 0; i < correctEdges.length; i++) {
                if (correctEdges[i].type == "Cancelling")
                    out += options.fn(correctEdges[i]);
            }
            return out;
        });

        Handlebars.registerHelper('pendingEdgeLength', function (edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
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
            let correctEvent = getObjects(events, "name", targetEventName);
            return options.fn(correctEvent[0]);
        });

        Handlebars.registerHelper('variableEach', function(context, options) {
            var fn = options.fn,
                inverse = options.inverse,
                ctx;
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
            } else {
                //noinspection TypeScriptValidateTypes
                ret = inverse(this);
            }
            return ret;
        });

        var t = Handlebars.compile(template);
        var rendered = t(simulation);
        return rendered;
    }
}

