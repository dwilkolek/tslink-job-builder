import { Writable } from "stream";
import { JobContext } from "../types/job-context";
import * as fs from 'fs';
import * as path from 'path';
import { isContext } from "vm";

export class WritableStreamWithStoreOffset extends Writable {
    lastCommin = Date.now();
    constructor(private context: JobContext, private emitDoneOn?: number) {
        super({ highWaterMark: 100, objectMode: true });
        this.processed = context.currentOffset ? context.currentOffset : 0;
        setInterval(() => {
            if (this.lastCommin + 2 * 60 * 1000 < Date.now()) {
                this.context.storeOffset(this.lastChunkId, () => {
                    this.context.done && this.context.done();
                })
            }
        })

    }

    processed = 0;
    buff: Buffer = Buffer.from('');
    lastChunkId = 0;
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this.buff = Buffer.concat([this.buff, Buffer.from(JSON.stringify(chunk))]);
        this.lastChunkId = chunk.id;
        this.processed++;
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
                this.buff = Buffer.from('');
                cb();
            });
        });
    }

}