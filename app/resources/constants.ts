/**
 * Created by abhinadduri on 7/3/16.
 */
export const incorrectThreadNumber = 'Each global variable should be a comma separated array specifiying an initial condition' +
'for each thread. For example, a global variable with a value of 2 in the first thread and ' +
'7 in the second thread should be [2,7].';

export const Downloads = {
    type: 'text/plain;charset=utf-8',
    taoFileExtension: '.txt',
    localRunFileExtension: '.js'
};
export const openError = 'Invalid File.';

export const Panel = {
    reset: 'reset all'
}

export const negativeThreads = 'Need at least one thread!';

export const Regex = {
    taoIdentifier: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    regexES6ReservedWord:  /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/,
    regexImmutableProps: /^(?:NaN|Infinity|undefined)$/,
    regexZeroWidth: /\u200C|\u200D/
}

interface AceWindow extends Window {
    ace: void
}

declare var window: AceWindow;

export const Ace: any = window.ace;

export const ERGTemplate = '{"name":"Simulation","time":5,"threads":1,"counter":1,"groupNameID":1,"variables":[],"edges":[],"events":[{"name":"Run","stateChange":"// your code here","x":"75","y":"150","trace":false,"parameters":{},"description":"Run event.","grouped":false,"groupedDOM":false,"visible":true}],"groups":[]}';
