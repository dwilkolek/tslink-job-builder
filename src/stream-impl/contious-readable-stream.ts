import { Readable } from "stream";
const fs = require('fs');

var es = require('event-stream');
export class ContinoiusReadableStream extends Readable {

    constructor() {
        super({highWaterMark:1})
    }
    _read(size: number) {
        
        this.push(JSON.stringify({name:"damian", age:Math.round(Math.random()*100)}));
    }


}