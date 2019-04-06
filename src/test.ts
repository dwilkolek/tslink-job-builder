import { ContinoiusReadableStream } from "./stream-impl/contious-readable-stream";
import { TransformingStream } from "./stream-impl/transforming-stream";
import { Writable, Readable, Transform } from "stream";
import * as fs from "fs";
import * as cluster from "cluster";
// const memwatch = require('memwatch-next');
// memwatch.on('leak', (info:any) => {
//     console.error('Memory leak detected:\n', info);
//   });
if (cluster.isMaster) {
    cluster.fork()
}
let res = false;
const s = Date.now();
for (let i = 0; i < 1000000; i++) {
    const exp = process.memoryUsage().heapUsed / 1024 / 1024 > 1000;
    res = exp;
}
const e = Date.now();
console.log(e - s)
const s1 = Date.now();
for (let i = 0; i < 1000000; i++) {
    const exp = i % 1000 == -1;
    res = exp;
}
const e1 = Date.now();

console.log(e1 - s1)

const fswriteStream = fs.createWriteStream('dupa.txt');

class wrtie extends Writable {

    constructor(private filename: string) {
        super({ objectMode: true });

    }

    buff: Buffer = Buffer.from('');
    byteOffset = 0;

    _write(chunk: any, encoding: any, done: any) {
        this.buff = Buffer.concat([this.buff, Buffer.from(JSON.stringify(chunk))]);
        // console.log(this.buff.length)
        if (this.buff.byteLength > 1024 * 1024 * 100) {
            fs.writeFile(this.filename, this.buff, (err) => {
                if (err) {
                    return console.log(err);
                }
                this.buff = Buffer.from('');
                console.log('writing to ', this.filename)
                done();
            });
        } else {
            done();
        }


    }
}

class read extends Readable {

    num = 0;

    constructor() {
        super({ objectMode: true, highWaterMark: 1 });

    }


    _read() {
        // if (this.num == -1000000) {
        //     this.push(null)

        // } else {
        this.push({ name: "dupa" });
        this.num++;
        // }

    }
}

class trans extends Transform {
    counter = 0;
    constructor() {
        super({ objectMode: true, highWaterMark: 10 });
    }
    _transform(chunk: any, encoding: any, done: any) {
        this.counter++;
        // if (this.counter % 10000 != 0) {
        //     setImmediate(() => {
        //         // console.log(
        //         //     'mem !'
        //         // )
        //         // const copy = JSON.parse(JSON.stringify(chunk));
        //         chunk.name = chunk.name + '1';
        //         done(null, chunk);
        //     });
        // } else {
        // setImmediate(() => {
        chunk.name = chunk.name + '1';
        done(null, chunk);
        // })
        // }
    }
}

const w = new wrtie('dupa.txt');
const r = new read();
const w2 = new wrtie('dupa2.txt');
const r2 = new read();
r.pipe(new trans()).pipe(w);


// r2.pipe(new trans()).pipe(w2);