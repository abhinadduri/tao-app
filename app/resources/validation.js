System.register(['../resources/constants'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var constants_1;
    var EDGE, Validation;
    return {
        setters:[
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }],
        execute: function() {
            (function (EDGE) {
                EDGE[EDGE["SOURCE"] = 0] = "SOURCE";
                EDGE[EDGE["TARGET"] = 1] = "TARGET";
            })(EDGE || (EDGE = {}));
            Validation = (function () {
                function Validation() {
                }
                Validation.testValidVariableName = function (name) {
                    return ((constants_1.Regex.taoIdentifier.test(name)) &&
                        !constants_1.Regex.regexES6ReservedWord.test(name) &&
                        !constants_1.Regex.regexImmutableProps.test(name) &&
                        !constants_1.Regex.regexZeroWidth.test(name));
                };
                Validation.isNumArray = function (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (typeof arr[i] != "number")
                            return false;
                    }
                    return true;
                };
                Validation.checkNames = function (eventList) {
                    for (var i = 0; i < eventList.length; i++) {
                        var name_1 = eventList[i].name;
                        if (!Validation.testValidVariableName(name_1)) {
                            alert(name_1 + ' is not a valid name for an event.');
                            return false;
                        }
                    }
                    return true;
                };
                Validation.checkParameters = function (eventList, edgeList) {
                    for (var i = 0; i < eventList.length; i++) {
                        var currentEvent = eventList[i];
                        var currentParams = currentEvent.parameters;
                        var targetEdges = Validation.getTargetEdges(currentEvent, edgeList);
                        for (var i_1 in currentParams) {
                            for (var j = 0; j < targetEdges.length; j++) {
                                if (!targetEdges[j].parameters.hasOwnProperty(i_1)
                                    || targetEdges[j].parameters[i_1] == "") {
                                    alert('A parameter field for parameter ' + i_1 + ' of event ' + currentEvent.name + ' has been left blank.');
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                };
                Validation.getSourceEdges = function (node, edgeList) {
                    var output = [];
                    for (var i = 0; i < edgeList.length; i++) {
                        if (edgeList[i].source === node.name)
                            output.push(edgeList[i]);
                    }
                    return output;
                };
                Validation.getTargetEdges = function (node, edgeList) {
                    var output = [];
                    for (var i = 0; i < edgeList.length; i++) {
                        if (edgeList[i].target === node.name)
                            output.push(edgeList[i]);
                    }
                    return output;
                };
                return Validation;
            }());
            exports_1("Validation", Validation);
        }
    }
});
//# sourceMappingURL=validation.js.map