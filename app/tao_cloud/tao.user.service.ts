/**
 * Created by abhinadduri on 8/1/16.
 */

import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class currentUser {
    public currentUser: User;

    constructor() {
        this.currentUser = null;
    }

    changeUser(user: User) {
        this.currentUser = user;
    }
}

export class User {
    private first_name: string;
    private last_name: string;
    private email: string;

    constructor(first_name, last_name, email) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }

    getFirstName(): string {
        return this.first_name;
    }

    getLastName(): string {
        return this.last_name;
    }

    getEmail(): string {
        return this.last_name;
    }

    setFirstName(name) {
        this.first_name = name;
    }

    setLastName(name) {
        this.last_name = name;
    }

    setEmail(email) {
        this.email = email;
    }
}