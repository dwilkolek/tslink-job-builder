import { Writable } from "stream";
import { JobContext } from "../types/job-context";

export class WritableStreamWithStoreOffset extends Writable {
    offset = 0;
    constructor(private context: JobContext) {
        super();
        if (context.currentOffset) {
            this.offset = context.currentOffset;
        }
    }
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this.offset++;
        console.log('storing offset ', this.offset)
        this.context.storeOffset(this.offset, (result) => {
            setTimeout(() => {
                callback()
            }, 2000);
        });

    }
}