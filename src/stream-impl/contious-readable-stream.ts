import { Readable } from "stream";
import { JobContext } from "../types/job-context";
const fs = require('fs');

var es = require('event-stream');
export class ContinoiusReadableStream extends Readable {

    constructor(private context: JobContext) {
        super({highWaterMark:1, objectMode: context.jobConfig.objectMode})
    }
    _read(size: number) {
        if (this.context.jobConfig.objectMode) {
            this.push({name:"damian", age:Math.round(Math.random()*100)});
        } else {
            this.push(JSON.stringify({name:"damian", age:Math.round(Math.random()*100)}));
        }
    }


}