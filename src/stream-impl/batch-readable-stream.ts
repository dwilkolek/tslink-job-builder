import { Readable } from "stream";
import { JobContext } from "../types/job-context";
const fs = require('fs');

var es = require('event-stream');
export class BatchReadableStream extends Readable {

    elementsCount = 0;

    constructor(private context: JobContext) {
        super({ highWaterMark: 1, objectMode: context.jobConfig.objectMode });
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
                if (this.context.jobConfig.objectMode) {
                    this.push({ name: "janobj", age: Math.round(Math.random() * 100) });
                } else {
                    this.push(JSON.stringify({ name: "janstr", age: Math.round(Math.random() * 100) }));
                }
                this.resume();
            }, 500);

        }
    }

    getProgress() {
        return this.elementsCount * 100 / 1000;
    }


}