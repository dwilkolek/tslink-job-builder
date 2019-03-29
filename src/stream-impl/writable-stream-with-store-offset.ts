import { Writable } from "stream";
import { JobContext } from "../types/job-context";

export class WritableStreamWithStoreOffset extends Writable {
    offset = 0;
    constructor(private context: JobContext) {
        super({highWaterMark: 1});
        if (context.currentOffset) {
            this.offset = context.currentOffset;
        }
    }
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this.cork();
        this.offset++;
        console.log('storing offset ', this.offset)
        this.context.storeOffset(this.offset, (result) => {
                this.uncork();
                callback()
        });

    }
}