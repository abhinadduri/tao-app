System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var incorrectThreadNumber, Downloads, openError, Panel, negativeThreads, Regex, Ace, ERGTemplate;
    return {
        setters:[],
        execute: function() {
            /**
             * Created by abhinadduri on 7/3/16.
             */
            exports_1("incorrectThreadNumber", incorrectThreadNumber = 'Each global variable should be a comma separated array specifiying an initial condition' +
                'for each thread. For example, a global variable with a value of 2 in the first thread and ' +
                '7 in the second thread should be [2,7].');
            exports_1("Downloads", Downloads = {
                type: 'text/plain;charset=utf-8',
                taoFileExtension: '.txt',
                localRunFileExtension: '.js'
            });
            exports_1("openError", openError = 'Invalid File.');
            exports_1("Panel", Panel = {
                reset: 'reset all'
            });
            exports_1("negativeThreads", negativeThreads = 'Need at least one thread!');
            exports_1("Regex", Regex = {
                taoIdentifier: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                regexES6ReservedWord: /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/,
                regexImmutableProps: /^(?:NaN|Infinity|undefined)$/,
                regexZeroWidth: /\u200C|\u200D/
            });
            exports_1("Ace", Ace = window.ace);
            exports_1("ERGTemplate", ERGTemplate = '{"name":"Simulation","time":5,"threads":1,"counter":1,"groupNameID":1,"variables":[],"edges":[],"events":[{"name":"Run","stateChange":"// your code here","x":"75","y":"150","trace":false,"parameters":{},"description":"Run event.","grouped":false,"groupedDOM":false,"visible":true}],"groups":[]}');
        }
    }
});
//# sourceMappingURL=constants.js.map