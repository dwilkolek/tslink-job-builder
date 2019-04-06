import { Readable } from "stream";
import { JobContext } from "../types/job-context";
const fs = require('fs');

var es = require('event-stream');
export class ContinoiusReadableStream extends Readable {
    offset = 0;
    constructor(private context: JobContext) {
        super({ highWaterMark: 10, objectMode: true })
        if (context.currentOffset) {
            this.offset = context.currentOffset;
        }
    }
    _read(size: number) {
        this.push({ id: this.offset, name: "damian", age: Math.round(Math.random() * 100) });
    }


}