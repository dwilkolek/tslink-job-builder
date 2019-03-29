import { Readable } from "stream";
import { JobContext } from "../types/job-context";
const fs = require('fs');

var es = require('event-stream');
export class BatchReadableStream extends Readable {

    elementsCount = 0;

    constructor(private context: JobContext) {
        super({highWaterMark: 1});
        if (context.currentOffset) {
            this.elementsCount = context.currentOffset;
        }
    };

    _read(size: number) {
        
        if (this.elementsCount == 1000) {
            this.push(null)
        } else {
            this.elementsCount++;
            this.pause();
            setTimeout(() => {
                this.push(JSON.stringify({ name: "jan", age: Math.round(Math.random() * 100) })+'\r\n');
                this.resume();
            }, 500);
                    
        }
    }

    getProgress() {
        return this.elementsCount*100/1000;
    }


}