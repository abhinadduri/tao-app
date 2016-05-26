/**
 * Created by abhinadduri on 5/26/16.
 */
import {Component, Input} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
    selector: 'javascript-help',
    template: `
    <div [ngStyle]="{'margin-top':'25px'}">
        <h4 [ngStyle]="{'text-align':'left'}">{{selectedSubComponent}}</h4>
        <br/>
        
        <div *ngIf="selectedSubComponent=='General'"
        [ngStyle]="{'text-align':'left'}">
            <p>Tao requires state changes to be written in Javascript. The following sections go over the basics that 
            commonly <br />come up when dealing with simulations.</p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Variables'"
        [ngStyle]="{'text-align':'left'}">
            <p>Javascript is a weakly typed language. You do not need to declare the type of a variable when you create it. 
            To make a <br />variable named x with a value of five, you would use the command 'var x = 5'. You can change this variable to<br />
            be anything ('x = 'string'; would be a valid command) -- it is up to the programmer to manage the types of variables.</p>
            <br />
        </div>
        
        <div *ngIf="selectedSubComponent=='Functions'"
        [ngStyle]="{'text-align':'left'}">
            <p>Javascript allows for functions as variables. A simple function that returns the sum of two variables is defined as follows:<br />
            function sum(a, b) {<br />
            &nbsp;&nbsp;return a + b;<br />
            }<br />
            Javascript also allows for anonymous functions, which must be used to define a global variable as a function. To make the above
            function <br /> compatible with Tao, define a new global variable with the name sum, and set its initial value to:
            'function(a, b) { return a + b; }'.<br />This function can now be evoked anywhere in the simulation as 'globals.sum'.
            </p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Arrays'"
        [ngStyle]="{'text-align':'left'}">
            <p>To define an empty array in Javascript, you can run the command 'var arr = []'. You can then push elements to the array by <br />
            using arr.push(5), or to make the first element 5, arr[0] = 5. There is no such thing as malloc in Javascript. Additionally, an <br />
            array can store variables of different types, i.e. 'var arr = [5, "a string"]. To use an empty array as a global variable, create 
            a <br /> new global variable and set its initial value to '[]'. To set a prepopulated array as a global variable, do the same with a 
            comma <br />separated list, i.e. '[1,2,3,4,5]'.</p>
        </div>
        
        <div *ngIf="selectedSubComponent=='Objects'"
        [ngStyle]="{'text-align':'left'}">
            <p>A Javascript object is defined in the same way a dictionary is. To create an object with a key of 'name' and a value of 'Tao',<br />
            run the command 'var obj = {"name": "Tao"}'. You can then access that property with the command 'obj.name', which will return <br />
            "Tao". The keys must always be integers or strings, but the values can be anything - even an array or another object.<br /><br />
            For example, 'var listOfPeople = {"students": [{"name": "Jack"}, {"name": "Jill"}]}'. To use an object as a global variable, 
            create a <br />global variable with the desired name and set its value to '{}', or any prepopulated object.
            </p>
        </div>
    </div>
    `,
    directives: [NgStyle]
})

export class JavascriptHelp {
    @Input() selectedSubComponent: string;

}