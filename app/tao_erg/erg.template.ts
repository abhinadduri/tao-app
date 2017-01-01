// import * as Handlebars from 'handlebars'

export class ErgTemplate {

    constructor() {}

    public static makeTemplate(simulation: any) {
        let template = `
        function () {
          var self = this;
          var globals = this;
            
          {{#each events}}
          
          self.{{name}} = function(scheduler, params) {
            this.name = "{{name}}";
            {{{stateChange}}}
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
            
            {{#getTargets name ../edges}} 
            
            {{#immediate nameOfEdge name ../../edges}}
            if ({{{../condition}}} || {{../pending}}) {
            scheduler.schedule("{{target}}",
            this,
            Math.max(0, {{#if ../pending}}0{{else}}{{#getDelayByID ../id ../../../edges}}{{delay}}{{/getDelayByID}}{{/if}} + {{{delay}}}),
            {{priority}},
            self.{{target}},
            {{#parameters parameters}}{{{params}}}{{/parameters}},
            {{#getEvent ../../../events target}}{{trace}}{{/getEvent}});
            }
            {{/immediate}}
            
            {{/getTargets}}
        
            {{#getPendingEdges ../edges name}}
            scheduler.schedulePending("{{#getEvent ../../events target}}{{name}}{{/getEvent}}", 
            this, 
            {{delay}}, 
            {{priority}}, 
            self.{{#getEvent ../../events target}}{{name}}{{/getEvent}}, 
            {{#parameters parameters}}{{{params}}}{{/parameters}}, 
            {{#getEvent ../../events target}}{{trace}}{{/getEvent}}, 
            "{{{condition}}}",
            function(globals) { return {{{condition}}}; },
            function(globals) { return {{{endCondition}}}; });
            {{/getPendingEdges}}
            
        
            {{#getCancellingEdges ../edges name}}
            scheduler.scheduleCancelling("{{#getEvent ../../events target}}{{name}}{{/getEvent}}", this, 
            {{#parameters parameters}}{{{params}}}{{/parameters}},
            function(globals) { return {{{condition}}} },
            {{delay}},
            "{{subType}}");
            {{/getCancellingEdges}}
          }
        
          {{/each}}
        }
        `;

        function stringify(parameters) {
            let toReturn = "{";
            for (let key in parameters) {
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
            let newObj = [];

            for (let i = 0; i < obj.length; i++) {
                let testObject = obj[i];

                for (let k in testObject) {
                    if (k == key && testObject[k] == val)
                        newObj.push(testObject);
                }
            }

            return (newObj);
        }

        function getNegativeDelaysForEvent(event: string, edges: any, currentDelay: number) {
            let a = [];
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].source == event) {
                    if (edges[i].type == 'Preceding') {
                        a.push({'target': edges[i].target,
                                'delay': currentDelay  + '-' + edges[i].delay,
                                'priority': edges[i].priority,
                                'parameters': edges[i].parameters,
                                'condition': edges[i].condition,
                                'endCondition': edges[i].endCondition});
                        a = a.concat(getNegativeDelaysForEvent(edges[i].target, edges, currentDelay  + '-' + eval(edges[i].delay)));
                    } else if (edges[i].type == 'Succeeding') {
                        a.push({'target': edges[i].target,
                                'delay': currentDelay + '+' + edges[i].delay,
                                'priority': edges[i].priority,
                                'parameters': edges[i].parameters,
                                'condition': edges[i].condition,
                                'endCondition': edges[i].endCondition});
                        a = a.concat(getNegativeDelaysForEvent(edges[i].target, edges, currentDelay  + '+' + edges[i].delay));
                    }
                }
            }
            return a;
        }

        function getTargetEvents(event: string, edges: any) {
            let a = [];
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].source == event && (edges[i].type == 'Scheduling' || edges[i].type == 'Pending'))
                    a.push({'nameOfEdge': edges[i].target, 'id': edges[i].id, 'condition': edges[i].condition, 'pending': edges[i].type == 'Pending'});
            }
            return a;
        }

        Handlebars.registerHelper('getDelayByID', function(id, edges, options) {
           for (let i = 0; i < edges.length; i++) {
               if (edges[i].id == id)
                   // console.log(edges[i])
                   return options.fn({
                       'delay': edges[i].delay
                   });
           }
        });

        Handlebars.registerHelper('getTargets', function(name, edges, options) {
            let correctEvents = getTargetEvents(name, edges);
            let out = "";
            for (let i = 0; i < correctEvents.length; i++) {
                out += options.fn(correctEvents[i]);
            }
            return out;
        })

        Handlebars.registerHelper('immediate', function(name, i, edges, options) {
            // console.log(name, i)
            let correctEdges = getNegativeDelaysForEvent(name, edges, 0);
            let out = "";
            for (let i = 0; i < correctEdges.length; i++) {
                out += options.fn(correctEdges[i]);
            }
            return out;
        })

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
            let out = "";
            for (let i = 0; i < correctEdges.length; i++) {
                if (correctEdges[i].type == "Scheduling")
                    out += options.fn(correctEdges[i]);
            }
            return out;
        });

        Handlebars.registerHelper('getPendingEdges', function (edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
            let out = "";
            for (let i = 0; i < correctEdges.length; i++) {
                if (correctEdges[i].type == "Pending")
                    out += options.fn(correctEdges[i]);
            }
            return out;
        });

        Handlebars.registerHelper('getCancellingEdges', function(edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
            let out = "";
            for (let i = 0; i < correctEdges.length; i++) {
                if (correctEdges[i].type == "Cancelling")
                    out += options.fn(correctEdges[i]);
            }
            return out;
        });

        Handlebars.registerHelper('pendingEdgeLength', function (edges, eventName, options) {
            let correctEdges = getObjects(edges, "source", eventName);
            let list = [];
            for (let i = 0; i < correctEdges.length; i++) {
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
            let fn = options.fn,
                inverse = options.inverse,
                ctx;
            let ret = "";

            if (context && context.length > 0) {
                for (let i = 0, j = context.length; i < j; i++) {
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

        let t = Handlebars.compile(template);
        let rendered = t(simulation);
        return rendered;
    }
}

