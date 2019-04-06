import { Writable } from "stream";
import { JobContext } from "../types/job-context";
import * as fs from 'fs';
import * as path from 'path';

export class WritableStreamWithStoreOffset extends Writable {
    constructor(private context: JobContext) {
        super({ highWaterMark: 100, objectMode: true });
    }
    buff: Buffer = Buffer.from('');
    lastChunkId = 0;
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this.buff = Buffer.concat([this.buff, Buffer.from(JSON.stringify(chunk))]);
        this.lastChunkId = chunk.id;
        if (this.buff.byteLength > 1024 * 100) {
            this.storeOffset(() => {
                callback();
            })
        } else {
            callback();
        }
    }
    storeOffset(cb: () => void) {
        fs.writeFile(path.join(this.context.workspaceDirectory, 'dump.txt'), this.buff, () => {
            this.context.storeOffset(this.lastChunkId, () => {
                this.context.storeProgress(this.lastChunkId * 100 / 10000000)
                this.buff = Buffer.from('');
                cb();
            });
        });
    }
}