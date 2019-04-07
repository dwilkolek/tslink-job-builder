import { Readable } from "stream";
import { JobContext } from "../types/job-context";
const fs = require('fs');
export class BatchReadableStream extends Readable {

    elementsCount = 0;

    constructor(private context: JobContext) {
        super({ highWaterMark: 1, objectMode: true });
        if (context.currentOffset) {
            this.elementsCount = context.currentOffset;
        }
    };

    _read(size: number) {
        this.context.storeProgress(this.getProgress())

        if (this.elementsCount >= 500000) {
            this.push(null);
        } else {
            this.elementsCount++;
            this.push({ id: this.elementsCount, name: "janobj", age: Math.round(Math.random() * 100) });

        }
    }

    getProgress() {
        return this.elementsCount * 100 / 500000;
    }


}