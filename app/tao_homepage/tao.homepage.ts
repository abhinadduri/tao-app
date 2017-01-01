/**
 * Created by abhinadduri on 7/27/16.
 */

import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Component({
    selector: 'login',
    template: `
        <h4>Login</h4>
        
        <input #username placeholder="username">
        <input #password type="password" placeholder="password">
        <button (click)="login(username.value, password.value)">Login</button>
        <br />
        
        <h4>Register</h4>
        
        <input #first_name placeholder="First Name">
        <input #last_name placeholder="Last Name">
        <input #email placeholder="Email">
        <input #pass type="password" placeholder="Password">
        <input #pass2 type="password" placeholder="Password">
        <h4 *ngIf="pass.value != pass2.value">Passwords do not match.</h4>
        <button [disabled]="pass.value != pass2.value"
                (click)="register(first_name.value, last_name.value, email.value, pass.value)">
                Register</button>
    `,
    directives: [ROUTER_DIRECTIVES, NgStyle]
})

export class LoginComponent {

    constructor(public http: Http, public router: Router) {
        let _build = (<any> http)._backend._browserXHR.build;
        (<any> http)._backend._browserXHR.build = () => {
            let _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        }
    }

    login(username, password) {
        let body = JSON.stringify({email: username, password: password});
        let headers = new Headers({'Content-Type': 'application/json', withCredentials: true});
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://127.0.0.1:3000/users/login', body, options)
            .map(res => res.text())
            .subscribe(data => {
                console.log(data);
                this.router.navigateByUrl('dashboard');
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
            .map((res: Response) => res.text())
            .subscribe(data => console.log(data));
    }

}