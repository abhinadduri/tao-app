import {Component, OnInit, ViewChild} from '@angular/core';
import {NgStyle} from '@angular/common'
import {TaoEvent} from './../tao_event/tao.event';
import {TaoEdge} from './../tao_edge/tao.edge';
import {TaoGroup} from './../tao_group/tao.group';
import {TaoSidebar} from './../tao_sidebar/tao.sidebar';
import {Edge} from './../tao_edge/tao.edge.model';
import {Event} from './../tao_event/tao.event.model';
import {Group} from './../tao_group/tao.group.model';
import {Variable} from './../tao_variable/tao.variable.model';
import {ErgTemplate} from './erg.template';
import {Engine} from './erg.engine';
import {Stats} from '../resources/stats';
import {LocalRun} from './erg.local';
import {Validation} from '../resources/validation';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {currentERG} from '../tao_cloud/tao.erg.service';
import {currentUser, User} from '../tao_cloud/tao.user.service';
import {incorrectThreadNumber, Downloads, Panel, openError, negativeThreads, ERGTemplate} from '../resources/constants';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import * as _ from 'underscore';
import 'rxjs/add/operator/map';


@Component({
    selector: 'erg',
    directives: [TaoEvent, TaoEdge, TaoSidebar, TaoGroup, MODAL_DIRECTIVES, NgStyle],
    templateUrl: './app/tao_erg/erg.component.tpl.html'
})

export class ErgComponent implements OnInit {

    ergID: string;
    counter: number;
    groupNameID: number;
    selectedParticle: any;
    shiftSelectedSource: Event;
    selectedVariablePanel: boolean;
    eventList: Event[];
    edgeList: Edge[];
    variableList: Variable[];
    groupList: Group[];
    groupStart: boolean;
    groupCounter: number;
    history: string[];
    currentVersion = 0;
    simulationName: string;
    simulationDescription: string;
    timeUnits: number;
    threads: number;
    graphData: any;
    graphingVariable: string;
    copyVariable: any;
    // onesecondclick: boolean;
    // startingPosX: string;
    // startingPosY: string;
    // screenSize: number;

    private sub: any;

    ngOnDestroy() {
        // this.sub.unsubscribe();
    }
    

    @ViewChild('background') modal: ModalComponent;

    constructor(public http: Http,
                public router: Router,
                public route: ActivatedRoute,
                public erg: currentERG,
                public user: currentUser) {
        let _build = (<any> http)._backend._browserXHR.build;
        (<any> http)._backend._browserXHR.build = () => {
            let _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        }
    }

    ngOnInit() {

        // window.oncontextmenu = function(event) {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     return false;
        // };

        // this.screenSize = window.screen.width * window.screen.height;
        this.loadFromText(ERGTemplate);

        // this.http.get('http://127.0.0.1:3000/users/currentUser')
        //     .subscribe(data => {
        //         if (data.text() != "error" && data.text() != "not logged in") {
        //             let user_data = data.json();
        //             this.user.changeUser(new User(user_data.first_name, user_data.last_name, user_data.email))
        //         }
        //         else
        //             this.user.changeUser(null);

        // });

        // this.sub = this.route.params.subscribe(params => {
        //     if (params['id'] == "playground") {
        //         this.loadFromText(ERGTemplate);
        //     } else {
        //         this.ergID = params['id'];
        //         let body = JSON.stringify({id: params['id']});
        //         let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
        //         let options = new RequestOptions({headers: headers});

        //         this.http.post('http://127.0.0.1:3000/users/getSimByID', body, options)
        //             .map(res => res.json())
        //             .subscribe(data => {
        //                 // insert failure logic
        //                 this.loadFromText(data.json);
        //             });
        //     }
        // });

        this.selectedParticle = null;
        this.shiftSelectedSource = null;
        this.selectedVariablePanel = false;

        this.graphData = {};
        this.copyVariable = null;

        this.groupStart = false;
        this.groupCounter = 0;


        this.currentVersion = 0;
        // this.onesecondclick = false;

    }


    handleHistoryUpdate() {
        this.erg.edited = true;

        if (this.history.length > 20)
            this.history.splice(0, 1);

        if (this.currentVersion >= 19)
            this.currentVersion = 19;

        else
            this.currentVersion ++;

        this.history.splice(this.currentVersion,
                            0,
                            JSON.stringify(this.produceErgJSON()));
    }

    handleUndo() {
        if (this.currentVersion == 0)
            return;
        this.selectedParticle = null;
        this.currentVersion--;
        this.loadFromText(this.history[this.currentVersion]);
    }

    // handleSave() {
    //     let simulation = JSON.stringify(this.produceErgJSON()).replace(/'/g, '\\\"');
    //     let body = JSON.stringify({id: this.ergID, sim: simulation, name: this.simulationName});
    //     let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
    //     let options = new RequestOptions({ headers: headers });

    //     this.http.post('http://127.0.0.1:3000/users/updateSimulation', body, options)
    //         .subscribe(data => {
    //             console.log('Simulation saved.');
    //             this.erg.edited = false;
    //         });
    // }

    // handleCloudRun() {
    //     // copied for now

    //     if (!Validation.checkParameters(this.eventList, this.edgeList) || !Validation.checkNames(this.eventList))
    //         return;

    //     for (var j = 0; j < this.variableList.length; j++) {
    //         let value;
    //         try {
    //             value = eval('(' + this.variableList[j].value + ')');
    //         } catch (e) {
    //             console.error(e);
    //             return;
    //         }

    //         if (this.threads > 1 && (!Array.isArray(value) || value.length != this.threads)) {
    //             alert(incorrectThreadNumber);
    //             return;
    //         }
    //     }

    //     let text = LocalRun.downloadTemplate(
    //         this.timeUnits,
    //         ErgTemplate.makeTemplate(this.produceErgJSON()),
    //         this.variableList,
    //         this.threads,
    //         this.simulationName,
    //         false);

    //     let body = JSON.stringify({id: this.ergID, code: text}).replace(/'/g, '\\\"');
    //     let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
    //     let options = new RequestOptions({ headers: headers });
    //     // console.log(body);
    //     this.http.post('http://127.0.0.1:3000/users/postJob', body, options)
    //         .subscribe(data => {});

    // }

    // handleDelete() {
    //     let body = JSON.stringify({id: this.ergID});
    //     let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
    //     let options = new RequestOptions({ headers: headers });

    //     this.http.post('http://127.0.0.1:3000/users/deleteSimulation', body, options)
    //         .subscribe(data => {
    //             if (data.text() == 'deleted') {
    //                 this.ergID = null;
    //                 this.router.navigate(['']);
    //             }
    //             this.erg.edited = false;
    //         });
    // }

    handleDownload() {
        let data = JSON.stringify(this.produceErgJSON());

        let blob = new Blob([data], {type: Downloads.type});
        saveAs(blob, this.simulationName + Downloads.taoFileExtension);
    }

    handleLocal() {
        if (!Validation.checkParameters(this.eventList, this.edgeList) || !Validation.checkNames(this.eventList))
            return;

        for (var j = 0; j < this.variableList.length; j++) {
            let value;
            try {
                value = eval('(' + this.variableList[j].value + ')');
            } catch (e) {
                console.error(e);
                return;
            }

            if (this.threads > 1 && (!Array.isArray(value) || value.length != this.threads)) {
                alert(incorrectThreadNumber);
                return;
            }
        }

        let text = LocalRun.downloadTemplate(
            this.timeUnits,
            ErgTemplate.makeTemplate(this.produceErgJSON()),
            this.variableList,
            this.threads,
            this.simulationName);

        let blob = new Blob([text], {type: Downloads.type});
        saveAs(blob, this.simulationName + Downloads.localRunFileExtension);
    }



    handleRun() {
        
        if (!Validation.checkParameters(this.eventList, this.edgeList)
            || !Validation.checkNames(this.eventList))
            return;
        try {
        this.selectedVariablePanel = true;
        this.unSelectFromPanel(Panel.reset);
        let generatedCode = ErgTemplate.makeTemplate(this.produceErgJSON());
        
        let compiledFunction;
        try {
            compiledFunction = eval('(' + generatedCode + ')');
        } catch (e) {
            console.error(e);
            return;
        }

        let scenarioList: any[] = [];
        let variableNames: string[] = [];

        for (let k = 0; k < this.variableList.length; k++) {
            let value;
            try {
                value = eval('(' + this.variableList[k].value + ')');
            } catch (e) {
                console.error(e);
                return;
            }

            if (typeof value == "number" ||
                (Array.isArray(value) &&
                value.length == this.threads &&
                Validation.isNumArray(value)))
                variableNames.push(this.variableList[k].name)
        }

        for (var i = 0; i < this.threads; i++) {
            let code = new compiledFunction();
            code.stats = new Stats();
            for (var j = 0; j < this.variableList.length; j++) {
                let value;
                try {
                    value = eval('(' + this.variableList[j].value + ')');
                } catch (e) {
                    console.error(e);
                }

                if (this.threads > 1 && (!Array.isArray(value) || value.length != this.threads)) {
                    alert(incorrectThreadNumber);
                    return;
                }

                if (this.threads == 1)
                    code[this.variableList[j].name] = value;
                else
                    code[this.variableList[j].name] = value[i];

            }
            scenarioList.push(code);
        }

        console.log('Running ' + this.simulationName);
        let engine = new Engine();
        this.graphData = engine.execute(scenarioList, this.timeUnits, this.threads, variableNames);
        if (!this.graphingVariable)
            if (this.variableList[0])
                this.graphingVariable = this.variableList[0].name;
        } catch(e) {
            console.log(e);
        }
    }

    handleOpen(e) {
        let file = e.target.files[0];
        if (!file) {
            alert(openError);
            return;
        }

        let reader = new FileReader();

        let self = this;

        reader.onload = function(e: any) {
            let target: any = e.target;
            self.unSelectFromPanel(Panel.reset);
            self.loadFromText(target.result);
        }

        reader.readAsText(file);
    }

    handleDrag(events: any) {
        let node = events.tao_event;
        let browser_event = events.window_event;

        // let dx = browser_event.clientX - parseInt(this.startingPosX);
        // let dy = browser_event.clientY - parseInt(this.startingPosY);
        // let dist = Math.sqrt(dx*dx + dy*dy);

        // if (dist >= this.screenSize * .000035)
        //     this.onesecondclick = false;

        if (node && this.selectedParticle) {
            var sourceEdges = Validation.getSourceEdges(node, this.edgeList);
            var targetEdges = Validation.getTargetEdges(node, this.edgeList);

            for (let i = 0; i < sourceEdges.length; i++) {
                sourceEdges[i].startX = (parseInt(node.x) + 35).toString();
                sourceEdges[i].startY = (parseInt(node.y) + 35).toString();
            }
            for (let i = 0; i < targetEdges.length; i++) {
                targetEdges[i].endX = (parseInt(node.x) + 35).toString();
                targetEdges[i].endY = (parseInt(node.y) + 35).toString();
            }
        }
    }

    handleDragGroup(g: Group) {
        if (g) {
            let incomingEdges = g.getIncomingEdges();
            let outgoingEdges = g.getOutgoingEdges();

            for (let i = 0; i < incomingEdges.length; i++) {
                incomingEdges[i].endX = (parseInt(g.x) + 35).toString();
                incomingEdges[i].endY = (parseInt(g.y) + 35).toString();
            }

            for (let i = 0; i < outgoingEdges.length; i++) {
                outgoingEdges[i].startX = (parseInt(g.x) + 35).toString();
                outgoingEdges[i].startY = (parseInt(g.y) + 35).toString();
            }
        }
    }

    updateThreads(num: number) {
        if (num <= 0) {
            alert(negativeThreads);
            this.threads = 1;
            return;
        }

        this.threads = num;
    }

    updateGraphVariable(graph: string) {
        this.graphingVariable = graph;
    }

    copySelectedItem() {
        if (this.selectedParticle)
            this.copyVariable = this.selectedParticle;
    }

    pasteSelectedItem() {
        if (this.copyVariable && this.copyVariable.constructor == Event) {
            let copy: Event = this.copyVariable;
            this.createGeneralEvent(
                copy.name + '_' + this.counter,
                (parseInt(copy.x) + 40).toString(),
                (parseInt(copy.y) + 40).toString(),
                copy.stateChange,
                copy.trace,
                copy.parameters,
                copy.description
            )
        }
        else if (this.copyVariable && this.copyVariable.constructor == Edge) {
            let copy: Edge = this.copyVariable;
            let source = copy.getSourceEvent(this.eventList);
            let target = copy.getTargetEvent(this.eventList);

            if (source == null || target == null)
                alert('The edge cannot be copied. Either the source or target event has been deleted.');
            else {
                this.createGeneralEdge(
                    copy.source,
                    copy.target,
                    copy.startX,
                    copy.startY,
                    copy.endX,
                    copy.endY,
                    copy.condition,
                    copy.endCondition,
                    copy.type,
                    copy.delay,
                    copy.priority,
                    copy.parameters,
                    copy.description,
                    copy.subType
                );
            }
        }
    }

    groupAndFinish() {
        this.groupStart = !this.groupStart;


        if (this.groupStart) {
            this.handleHistoryUpdate();
            let g = new Group('Group' + this.groupNameID, "" + Math.random()*200, "" + Math.random()*200);
            this.groupNameID++;
            this.groupList.push(g);
            this.groupCounter = this.groupList.indexOf(g);
        }

        else {
            let groupedEvents: Event[] = [];
            let subGroups: Group[] = [];

            for (let i = 0; i < this.eventList.length; i++) {
                if (this.eventList[i].groupedDOM) {
                    if (this.eventList[i].grouped) {
                        alert('Cannot put the same node into two groups.');
                    }
                    groupedEvents.push(this.eventList[i]);
                }

                this.eventList[i].groupedDOM = false;

            }

            for (let i = 0; i < this.groupList.length; i++) {
                if (this.groupList[i].groupedDOM) {
                    subGroups.push(this.groupList[i]);
                    this.groupList[i].groupedDOM = false;
                }
            }


            if (groupedEvents.length == 0 && subGroups.length == 0) {
                this.groupList.splice(this.groupCounter, 1);
                this.groupNameID--;
            }
            else {
                let currentGroup = this.groupList[this.groupCounter];
                currentGroup.visible = true;

                for (let j = 0; j < groupedEvents.length; j++)
                    currentGroup.addEvent(groupedEvents[j]);

                for (let k = 0; k < subGroups.length; k++) {
                    subGroups[k].grouped = true;
                    subGroups[k].parent = currentGroup;
                    currentGroup.addGroup(subGroups[k]);
                    subGroups[k].visible = false;
                }

                for (let i = 0; i < currentGroup.getEvents().length; i++) {
                    let eventIndex = this.eventList.indexOf(currentGroup.getEvents()[i]);
                    let currentEvent = this.eventList[eventIndex];

                    let sourceEdgesToEvent = Validation.getSourceEdges(currentEvent, this.edgeList);
                    let targetEdgesFromEvent = Validation.getTargetEdges(currentEvent, this.edgeList);

                    for (let j = 0; j < sourceEdgesToEvent.length; j++) {
                        let currentEdge = sourceEdgesToEvent[j];

                        let target = currentGroup.getEventByName(currentEdge.target)
                        if (target == -1) {
                            currentEdge.groupedSource = currentGroup.name;
                            // currentEdge.groupedTarget = currentEdge.target;
                            currentEdge.startX = (parseInt(currentGroup.x) + 35).toString();
                            currentEdge.startY = (parseInt(currentGroup.y) + 35).toString();
                            currentGroup.addOutgoingEdge(currentEdge);
                        }
                        else {
                            if (!this.getEventByEdgeTarget(currentEdge).grouped) {
                                currentGroup.addEdge(currentEdge);
                            }
                        }
                    }

                    for (let k = 0; k < targetEdgesFromEvent.length; k++) {
                        let currentEdge = targetEdgesFromEvent[k];
                        if (currentGroup.getEventByName(currentEdge.source) == -1) {
                            currentEdge.groupedTarget = currentGroup.name;
                            currentEdge.endX = (parseInt(currentGroup.x) + 35).toString();
                            currentEdge.endY = (parseInt(currentGroup.y) + 35).toString();
                            currentGroup.addIncomingEdge(currentEdge);
                        }

                    }
                }

                for (let j = 0; j < groupedEvents.length; j++)
                    groupedEvents[j].grouped = true;

                for (let i = 0; i < currentGroup.getGroups().length; i++) {
                    let subGroup = currentGroup.getGroups()[i];

                    // for (let j = 0; j < subGroup.getEvents().length; j++) {
                    //     if (currentGroup.getEvents().indexOf(subGroup.getEvents()[j]) == -1)
                    //         currentGroup.addEvent(subGroup.getEvents()[j]);
                    // }

                    for (let j = 0; j < subGroup.getOutgoingEdges().length; j++) {
                        // might be a problem later on
                        let currentSubEdge = subGroup.getOutgoingEdges()[j];
                        if (currentGroup.findByName(currentSubEdge.target)) {
                            currentSubEdge.groupedSource = "None";
                            currentSubEdge.groupedTarget = "None";
                            currentGroup.addEdge(currentSubEdge);
                        }
                        else {
                            currentSubEdge.groupedSource = currentGroup.name;
                            currentGroup.addOutgoingEdge(currentSubEdge);
                            currentSubEdge.startX = (parseInt(currentGroup.x) + 35).toString();
                            currentSubEdge.startY = (parseInt(currentGroup.y) + 35).toString();
                        }
                    }

                    for (let j = 0; j < subGroup.getIncomingEdges().length; j++) {
                        let currentSubEdge = subGroup.getIncomingEdges()[j];
                        if (currentGroup.findByName(currentSubEdge.source)) {
                            currentSubEdge.groupedSource = "None";
                            currentSubEdge.groupedTarget = "None";
                            currentGroup.addEdge(currentSubEdge);
                        }
                        else {
                            currentSubEdge.groupedTarget = currentGroup.name;
                            currentGroup.addIncomingEdge(currentSubEdge);
                            currentSubEdge.endX = (parseInt(currentGroup.x) + 35).toString();
                            currentSubEdge.endY = (parseInt(currentGroup.y) + 35).toString();
                        }
                    }

                }

                for (let i = 0; i < currentGroup.getEdges().length; i++) {
                    let currentEdge = currentGroup.getEdges()[i];
                    let ind = this.edgeList.indexOf(currentEdge);
                    if (ind != -1)
                        this.edgeList[ind].visible = false;
                }

                for (let j = 0; j < currentGroup.getEvents().length; j++) {
                    let currentEvent = currentGroup.getEvents()[j];
                    let ind = this.eventList.indexOf(currentEvent);
                    this.eventList[ind].visible = false;
                }
            }
        }

        this.unSelectFromPanel(Panel.reset);
    }

    handleUngroup(g: Group) {
        let ind = this.groupList.indexOf(g);
        if (g.parent == null) {
            this.handleHistoryUpdate();
            for (let i = 0; i < g.getEvents().length; i++) {
                g.getEvents()[i].visible = true;
                g.getEvents()[i].grouped = false;
            }

            for (let j = 0; j < g.getEdges().length; j++) {
                let currentEdge = g.getEdges()[j];
                currentEdge.groupedSource = "None";
                currentEdge.groupedTarget = "None";

                currentEdge.visible = true;
            }

            for (let i = 0; i < g.getIncomingEdges().length; i++) {
                let currentEdge = g.getIncomingEdges()[i];
                let targetEvent = this.getEventByEdgeTarget(currentEdge);
                currentEdge.groupedTarget = "None";

                if (!targetEvent.grouped) {
                    currentEdge.endX = (parseInt(targetEvent.x) + 35).toString();
                    currentEdge.endY = (parseInt(targetEvent.y) + 35).toString();
                }
            }

            for (let j = 0; j < g.getOutgoingEdges().length; j++) {
                let currentEdge = g.getOutgoingEdges()[j];
                let sourceEvent = this.getEventByEdgeSource(currentEdge);
                currentEdge.groupedSource = "None";

                if (!sourceEvent.grouped) {
                    currentEdge.startX = (parseInt(sourceEvent.x) + 35).toString();
                    currentEdge.startY = (parseInt(sourceEvent.y) + 35).toString();
                }
            }

            for (let k = 0; k < g.getGroups().length; k++) {
                let currentSubGroup = g.getGroups()[k];
                for (let i = 0; i < currentSubGroup.getIncomingEdges().length; i++) {
                    let currentSubEdge = currentSubGroup.getIncomingEdges()[i];
                    currentSubEdge.groupedTarget = currentSubGroup.name;
                    currentSubEdge.endX = (parseInt(currentSubGroup.x) + 35).toString();
                    currentSubEdge.endY = (parseInt(currentSubGroup.y) + 35).toString();
                }

                for (let j = 0; j < currentSubGroup.getOutgoingEdges().length; j++) {
                    let currentSubEdge = currentSubGroup.getOutgoingEdges()[j];
                    currentSubEdge.groupedSource = currentSubGroup.name;
                    currentSubEdge.startX = (parseInt(currentSubGroup.x) + 35).toString();
                    currentSubEdge.startY = (parseInt(currentSubGroup.y) + 35).toString();
                }

                currentSubGroup.visible = true;
                currentSubGroup.parent = g.parent;
            }

            g.visible = false;
            this.groupList.splice(ind, 1);
        }
        
    }
    
    unSelect(graph, e) {
        if (e.target == graph) {
            this.selectedParticle = null;
            this.shiftSelectedSource = null;

            this.selectedVariablePanel = false;
        }
    }

    unSelectFromPanel(type) {
        this.selectedParticle = null;
        this.shiftSelectedSource = null;

        if (type != Panel.reset)
            this.selectedVariablePanel = true
    }

    // disableLongPress() {
    //     this.onesecondclick = false;
    // }

    selectEvent(event: Event, e) {
        // this.onesecondclick = true;
        // this.startingPosX = event.x;
        // this.startingPosY = event.y;

        // setTimeout(() => {
        //     if (this.onesecondclick) {
        //         this.onesecondclick = false;
        //         this.selectShiftEvent(event, e);
        //     }
        // }, 1000);

        if (e.shiftKey)
            this.selectShiftEvent(event, e);
        else {
            this.selectedVariablePanel = false;
            this.selectedParticle = event;
        }

        if (this.groupStart && event.groupedDOM) {
            event.groupedDOM = false;
            this.unSelectFromPanel(Panel.reset);
            return;
        } else if (this.groupStart) {
            event.groupedDOM = true;
        }

    }

    selectShiftEvent(event : Event, e) {
        if (!this.shiftSelectedSource)
            this.shiftSelectedSource = event;
        else if (this.shiftSelectedSource) {
            this.createEdge(this.shiftSelectedSource.name, event.name);
            this.shiftSelectedSource = null;
        }

    }

    selectEdge(edge: Edge, e) {
        this.selectedVariablePanel = false;
        this.selectedParticle = edge;
    }

    selectGroup(group: Group, e) {

        this.selectedVariablePanel = false;
        this.selectedParticle = group;
        
        if (this.groupStart) { // && group.groupedDOM
            group.groupedDOM = true;
        } 
        // else if (this.groupStart) {
        //     group.groupedDOM = true;
        // }
    }

    createEvent(e, graph) {
        if (e.target == graph) {
            var name = "Event" + this.counter;
            var x = (e.clientX - 35).toString();
            var y = (e.clientY - 35).toString();
            var stateChange = `// your code here`;
            var event = new Event(name, stateChange, x, y, true, {}, name + " description.", false, false, true);
            this.counter++;
            this.eventList.push(event);
            this.handleHistoryUpdate();
        }
    }

    createGeneralEvent(name: string,
                       x: string,
                       y: string,
                       stateChange: string,
                       trace: boolean,
                       parameters: any,
                       description: string) {
        this.eventList.push(new Event(
            name, stateChange, x, y, trace, parameters, description, false, false, true
        ));
        this.counter++;
        this.handleHistoryUpdate();
    }

    createEdge(source : string, target : string) {
        let sourceEvent:Event = null;
        let targetEvent:Event = null;

        for (let i = 0; i < this.eventList.length; i++) {
            let currentEvent: Event = this.eventList[i];
            if (currentEvent.name === source)
                sourceEvent = currentEvent;
            if (currentEvent.name === target)
                targetEvent = currentEvent;
        }

        let newEdge: Edge = new Edge(
            source,
            target,
            (parseInt(sourceEvent.x) + 35).toString(),
            (parseInt(sourceEvent.y) + 35).toString(),
            (parseInt(targetEvent.x) + 35).toString(),
            (parseInt(targetEvent.y) + 35).toString(),
            'true',
            'false',
            'Scheduling',
            1,
            5,
            {},
            "Edge from " + source + " to " + target + ".",
            "Next",
            "None",
            "None",
            true,
            _.uniqueId()
        );

        this.edgeList.push(newEdge);
        this.handleHistoryUpdate();
    }

    createGeneralEdge(source: string,
                      target: string,
                      sourceX: string,
                      sourceY: string,
                      targetX: string,
                      targetY: string,
                      condition: string,
                      endCondition: string,
                      type: string,
                      delay: number,
                      priority: number,
                      parameters: any,
                      description: string,
                      subType: string) {
        let newEdge: Edge = new Edge(
            source, target, sourceX, sourceY, targetX, targetY, condition, endCondition, type, delay,
            priority, parameters, description, subType, "None", "None", true, _.uniqueId()
        );

        this.edgeList.push(newEdge);
        this.handleHistoryUpdate();
    }

    produceErgJSON() : any {
        let simulation = {};

        simulation['name'] = this.simulationName;
        simulation['time'] = this.timeUnits;
        simulation['threads'] = this.threads;
        simulation['counter'] = this.counter;
        simulation['groupNameID'] = this.groupNameID;

        simulation['variables'] = [];

        for (let i = 0; i < this.variableList.length; i++) {
            let currentVariable = this.variableList[i];

            simulation['variables'].push({
                    'name': currentVariable.name,
                    'value': currentVariable.value,
                    'description': currentVariable.description
                });
        }

        simulation['edges'] = [];

        for (let i = 0; i < this.edgeList.length; i++) {
            let currentEdge = this.edgeList[i];

            simulation['edges'].push({
                    'source': currentEdge.source,
                    'target': currentEdge.target,
                    'startX': currentEdge.startX,
                    'startY': currentEdge.startY,
                    'endX': currentEdge.endX,
                    'endY': currentEdge.endY,
                    'condition': currentEdge.condition,
                    'endCondition': currentEdge.endCondition,
                    'type': currentEdge.type,
                    'delay': currentEdge.delay,
                    'priority': currentEdge.priority,
                    'parameters': currentEdge.parameters,
                    'description': currentEdge.description,
                    'subType': currentEdge.subType,
                    'groupedSource': currentEdge.groupedSource,
                    'groupedTarget': currentEdge.groupedTarget,
                    'visible': currentEdge.visible,
                    'id': currentEdge.getId()
                });
        }

        simulation['events'] = [];

        for (let i = 0; i < this.eventList.length; i++) {
            let currentEvent = this.eventList[i];

            simulation['events'].push({
                    'name': currentEvent.name,
                    'stateChange': currentEvent.stateChange,
                    'x': currentEvent.x,
                    'y': currentEvent.y,
                    'trace': currentEvent.trace,
                    'parameters': currentEvent.parameters,
                    'description': currentEvent.description,
                    'grouped': currentEvent.grouped,
                    'groupedDOM': currentEvent.groupedDOM,
                    'visible': currentEvent.visible
                });
        }

        simulation['groups'] = [];

        for (let i = 0; i < this.groupList.length; i++) {
            let currentGroup = this.groupList[i];
            let groupNames: string[] = [];

            for (let j = 0; j < currentGroup.getGroups().length; j++)
                groupNames.push(currentGroup.getGroups()[j].name);

            simulation['groups'].push({
                'name': currentGroup.name,
                'x': currentGroup.x,
                'y': currentGroup.y,
                'eventList': JSON.stringify(currentGroup.eventList),
                'edgeList': JSON.stringify(currentGroup.edgeList),
                'outgoingEdges': JSON.stringify(currentGroup.outgoingEdges),
                'incomingEdges': JSON.stringify(currentGroup.incomingEdges),
                'parent': currentGroup.parent ? currentGroup.parent.name : null,
                'visible': currentGroup.visible,
                'grouped': currentGroup.grouped,
                'groupedDOM': currentGroup.groupedDOM
            });
        }
        // console.log(simulation);
        return simulation;
    }

    loadFromText(simulation: string) {
        let simJson = JSON.parse(simulation);
        this.clearERG();;


        this.simulationName = simJson.hasOwnProperty('name') ? simJson.name : 'Simulation';
        this.simulationDescription = simJson.hasOwnProperty('description') ? simJson.description : 'A sample description.';
        this.timeUnits = simJson.hasOwnProperty('time') ? simJson.time : 10;
        this.threads = simJson.hasOwnProperty('threads') ? simJson.threads : 1;
        this.counter = simJson.hasOwnProperty('counter') ? simJson.counter : 1;
        this.groupNameID = simJson.hasOwnProperty('groupNameID') ? simJson.groupNameID : 1;

        if (simJson.hasOwnProperty('variables')) {
            for (let i = 0; i < simJson.variables.length; i++) {
                let currentVariable = simJson.variables[i];

                this.variableList.push(
                    new Variable(
                        (currentVariable.hasOwnProperty('name') ? currentVariable.name : 'Variable' + i),
                        (currentVariable.hasOwnProperty('value') ? currentVariable.value : 0),
                        (currentVariable.hasOwnProperty('description') ? currentVariable.description : 'Description'))
                );
            }
        }

        if (simJson.hasOwnProperty('events')) {
            for (let i = 0; i < simJson.events.length; i++) {
                let currentEvent = simJson.events[i];

                this.eventList.push(
                    new Event(
                        (currentEvent.hasOwnProperty('name') ? currentEvent.name : 'Event' + i),
                        (currentEvent.hasOwnProperty('stateChange') ? currentEvent.stateChange : '// your code here'),
                        (currentEvent.hasOwnProperty('x') ? currentEvent.x.toString() : (i * 100).toString()),
                        (currentEvent.hasOwnProperty('y') ? currentEvent.y.toString() : (i * 100).toString()),
                        (currentEvent.hasOwnProperty('trace') ? currentEvent.trace : true),
                        (currentEvent.hasOwnProperty('parameters') ? currentEvent.parameters : {}),
                        (currentEvent.hasOwnProperty('description') ? currentEvent.description : "Description."),
                        (currentEvent.hasOwnProperty('grouped') ? currentEvent.grouped : false),
                        (currentEvent.hasOwnProperty('groupedDOM') ? currentEvent.groupedDOM : false),
                        (currentEvent.hasOwnProperty('visible') ? currentEvent.visible : true))
                );
            }

            if (this.eventList.length == 0) {
                this.eventList = [
                    new Event("Run", "// your code here", "50", "50", false, {}, "Run event.", false, false, true)
                ];
            }
        }

        if (simJson.hasOwnProperty('edges')) {
            for (let i = 0; i < simJson.edges.length; i++) {
                let currentEdge = simJson.edges[i];
                this.edgeList.push(
                    new Edge(
                        (currentEdge.hasOwnProperty('source') ? currentEdge.source : null),
                        (currentEdge.hasOwnProperty('target') ? currentEdge.target : null),
                        (currentEdge.hasOwnProperty('startX') ? currentEdge.startX : null),
                        (currentEdge.hasOwnProperty('startY') ? currentEdge.startY : null),
                        (currentEdge.hasOwnProperty('endX') ? currentEdge.endX : null),
                        (currentEdge.hasOwnProperty('endY') ? currentEdge.endY : null),
                        (currentEdge.hasOwnProperty('condition') ? currentEdge.condition : 'true'),
                        (currentEdge.hasOwnProperty('endCondition') ? currentEdge.endCondition : 'false'),
                        (currentEdge.hasOwnProperty('type') ? currentEdge.type : 'Scheduling'),
                        (currentEdge.hasOwnProperty('delay') ? currentEdge.delay : 1),
                        (currentEdge.hasOwnProperty('priority') ? currentEdge.priority : 5),
                        (currentEdge.hasOwnProperty('parameters') ? currentEdge.parameters : {}),
                        (currentEdge.hasOwnProperty('description') ? currentEdge.description :
                        "Edge from " + currentEdge.source + " to " + currentEdge.target + "."),
                        (currentEdge.hasOwnProperty('subType') ? currentEdge.subType : "Next"),
                        (currentEdge.hasOwnProperty('groupedSource') ? currentEdge.groupedSource : "None"),
                        (currentEdge.hasOwnProperty('groupedTarget') ? currentEdge.groupedTarget : "None"),
                        (currentEdge.hasOwnProperty('visible') ? currentEdge.visible : true),
                        (_.uniqueId())
                    )
                );
            }
        }

        if (simJson.hasOwnProperty('groups')) {
            for (let i = 0; i < simJson.groups.length; i++) {

                let currentGroup = simJson.groups[i];

                let groupToAdd = new Group(currentGroup.name, currentGroup.x, currentGroup.y);

                let eventList = JSON.parse(currentGroup.eventList);
                for (let j = 0; j < eventList.length; j++)
                    groupToAdd.addEvent(this.getEventByName(eventList[j].name));

                let edgeList = JSON.parse(currentGroup.edgeList);
                for (let j = 0; j < edgeList.length; j++)
                    groupToAdd.addEdge(this.getEdgeById(edgeList[j].id));

                let incomingEdges = JSON.parse(currentGroup.incomingEdges);
                for (let j = 0; j < incomingEdges.length; j++)
                    groupToAdd.addIncomingEdge(this.getEdgeById(incomingEdges[j].id));

                let outgoingEdges = JSON.parse(currentGroup.outgoingEdges);
                for (let j = 0; j < outgoingEdges.length; j++)
                    groupToAdd.addOutgoingEdge(this.getEdgeById(outgoingEdges[j].id));

                groupToAdd.visible = currentGroup.visible;
                groupToAdd.grouped = currentGroup.grouped;
                groupToAdd.groupedDOM = currentGroup.groupedDOM;
                groupToAdd.parent = currentGroup.parent;

                this.groupList.push(groupToAdd);
            }

            for (let i = 0; i < this.groupList.length; i++) {
                if (this.groupList[i].parent != null)
                    // currently not typesafe, property is set as a string in the previous for loop
                    this.groupList[i].parent = this.getGroupByName(this.groupList[i].parent);
            }

            for (let i = 0; i < this.groupList.length; i++) {
                let currentGroup = this.groupList[i];
                for (let j = 0; j < this.groupList.length; j++)
                    if (this.groupList[j].parent == currentGroup)
                        currentGroup.addGroup(this.groupList[j]);
            }

        }

        this.erg.changeModel(this.produceErgJSON());
        this.history = [JSON.stringify(this.produceErgJSON())];
    }

    private getEventByEdgeSource(e: Edge): Event {
        for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].name == e.source)
                return this.eventList[i];
        }
        return null;
    }

    private getEventByEdgeTarget(e: Edge): Event {
        for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].name == e.target)
                return this.eventList[i];
        }
        return null;
    }

    private getEventByName(name: string): Event {
        for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].name == name)
                return this.eventList[i];
        }
        return null;
    }

    private getGroupByName(name: string): Group {
        for (let i = 0; i < this.groupList.length; i++) {
            if (this.groupList[i].name == name)
                return this.groupList[i];
        }

        return null;
    }

    private getEdgeById(id: string): Edge {
        for (let i = 0; i < this.edgeList.length; i++) {
            if (this.edgeList[i].getId() == id)
                return this.edgeList[i];
        }
        return null;
    }

    private clearERG() {
        this.eventList = [];
        this.edgeList = [];
        this.variableList = [];
        this.groupList = [];
    }
}

