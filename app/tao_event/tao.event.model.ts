/**
 * Created by abhinadduri on 4/24/16.
 */
export class Event {
    constructor(
        public name: string,
        public stateChange: string,
        public x: string,
        public y: string,
        public trace: boolean,
        public parameters: {}
    ) { }
}
