/**
 * Created by abhinadduri on 7/27/16.
 */

import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {currentUser, User} from '../tao_cloud/tao.user.service';
import {ERGTemplate} from '../resources/constants';
import {SearchPipe} from './tao.search.pipe';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Component({
    selector: 'login',
    pipes: [SearchPipe],
    template: `
        <!--<div style="width: calc(100% - 75px - 400px); display: inline-block;">-->
        <!--Hello world-->
        <!--</div>-->
        <div *ngIf="!user.currentUser" class="loginArea">
            <div class="credentials">
                <input #username placeholder="Email" class="username" />
                <input #password placeholder="Password" type="password" class="password" />
            
                <div *ngIf="!loginButton">
                    <input #first_name placeholder="First Name" class="password" style="color: white"> <br />
                    <input #last_name  placeholder="Last Name" class="password" style="color: white"> <br />
                    <span class="signupMessage">Already have an account? <a (click)="loginButton=true">Login</a></span>
                    <br />
                    <button (click)="register(first_name.value, last_name.value, username.value, password.value)" class="loginButton">Register</button> <br />
                </div>
                
                <div *ngIf="loginButton">
                    <span class="signupMessage">Don't have an account? <a (click)="loginButton=false">Sign up</a></span>
                    <br />
                </div>
                
                <button *ngIf="loginButton"(click)="login(username.value, password.value)" class="loginButton">Submit</button>
            
            </div>
        </div>
        
        <div *ngIf="user.currentUser" class="loginArea">
        
            <div *ngIf="user.currentUser">
                <div class="loginBackground">
                    <h4 class="welcome">Hello, {{user.currentUser.first_name}}</h4> <br />
                    <div class="simulationList">
                    <input #searchBar class="search" placeholder="Search" (input)="query=searchBar.value"/>
                    <div *ngFor="let sim of simulations | search : query"
                               (click)="loadERG(sim)"
                               class="simulationItem">
                               <span class="simulationName">{{sim.name}}</span>
                               <span class="simulationName">Status: {{sim.status}}</span>
                    </div>
                               
                    <button (click)="createERG()" class="newSimulation"><span>Create New Simulation</span></button>
                    </div>
                </div>
            </div>
            
        </div>
        
        <div class="loginMenu">
        
        <div class="login">
            <span>{{user.currentUser ? "Simulations" : "Login"}}</span>
        </div>
        </div>

        
        <!--<div *ngIf="!user.currentUser" class="loginBackground">-->
        <!--<div class="loginBox">-->
        <!--<br />-->
        <!--<div class="credentials" [ngStyle]="{'transform': !loginButton ? 'translateY(10%)' : ''}">-->
        <!---->
        <!--<h3>Tao</h3>-->
        <!--<input #username placeholder="email" class="username" style="color: white"> <br />-->
        <!--<input #password type="password" placeholder="password" class="password" style="color: white"> <br />-->
        <!---->
        <!--<div *ngIf="!loginButton">-->
        <!--<input #first_name placeholder="First Name" class="password" style="color: white"> <br />-->
        <!--<input #last_name  placeholder="Last Name" class="password" style="color: white"> <br />-->
        <!--<button (click)="register(first_name.value, last_name.value, username.value, password.value)" class="loginButton">Register</button> <br />-->
        <!--<span class="signupMessage">Already have an account? <a (click)="loginButton=true">Login</a></span>-->
        <!--</div>-->
        <!---->
        <!--<div *ngIf="loginButton">-->
        <!--<button (click)="login(username.value, password.value)" class="loginButton">Login</button> <br />-->
        <!--<span class="signupMessage">Don't have an account? <a (click)="loginButton=false">Sign up</a></span>-->
        <!--<br />-->
        <!--</div>-->
        <!---->
        <!--<br />-->
        <!--</div> -->
        <!---->
        <!--</div>-->
        <!--</div>-->
    `,
    directives: [ROUTER_DIRECTIVES, NgStyle]
})

export class HomepageComponent {

    simulations: CloudSimulation[];
    loginButton: boolean;
    query: string;
    polling: any;

    constructor(public http: Http, public router: Router, public user: currentUser) {
        let _build = (<any> http)._backend._browserXHR.build;
        (<any> http)._backend._browserXHR.build = () => {
            let _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        }

        this.loginButton = true;
        this.query = '';
    }

    ngOnInit() {
        this.query = '';
        this.loginButton = true;
        this.getFeed();
        let self = this;
        this.polling = setInterval(function() {
            Reflect.apply(self.getFeed, self, []);
        }, 10000);
    }

    ngOnDestroy() {
        clearInterval(this.polling);
        this.polling = null;
    }

    private getFeed() {
        this.http.get('http://127.0.0.1:3000/users/currentUser')
            .subscribe(data => {

                if (data.text() != "error" && data.text() != "not logged in") {
                    let user_data = data.json();
                    this.user.changeUser(new User(user_data.first_name, user_data.last_name, user_data.email))

                }
                else
                    this.user.changeUser(null);

            })

        this.http.get('http://127.0.0.1:3000/users/getListByCookie')
            .subscribe(data => {
                if (data.text() != "error" && data.text() != "not logged in")
                    this.simulations = data.json();
                else
                    this.user.changeUser(null);
            });
    }

    login(username, password) {
        let body = JSON.stringify({email: username, password: password});
        let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://127.0.0.1:3000/users/login', body, options)
            .subscribe(data => {
                // insert error logic
                console.log(data);
                if (data.text() != 'error' && data.text() != 'not logged in')
                    this.getFeed();
            });
    }

    register(first_name, last_name, email, password) {
        let body = JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        });

        let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://127.0.0.1:3000/users/register', body, options)
            // .map((res: Response) => res.text())
            .subscribe(data => {
                if (data.text() != "error") {
                    let user_data = data.json();
                    this.user.changeUser(new User(user_data.first_name, user_data.last_name, user_data.email))
                }
            });
    }

    loadERG(sim: CloudSimulation) {
        this.router.navigate(['/erg', sim.id]);
    }

    createERG() {
        let body = JSON.stringify({json: ERGTemplate, name: "Simulation"});
        let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
        let options = new RequestOptions({ headers: headers });

        this.http.post('http://127.0.0.1:3000/users/createSimulation', body, options)
            .map(res => res.text())
            .subscribe(data => {
                if (this.simulations)
                    this.simulations.push(new CloudSimulation(data, "Simulation"));
                else
                    this.simulations = [new CloudSimulation(data, "Simulation")];
                this.router.navigate(['/erg', data]);
            })
    }

}

class CloudSimulation {
    id: string;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}