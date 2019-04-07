import { ContinoiusReadableStream } from "./stream-impl/contious-readable-stream";
import { TransformingStream } from "./stream-impl/transforming-stream";
import { Writable, Readable, Transform } from "stream";
import * as fs from "fs";
import * as cluster from "cluster";
// const memwatch = require('memwatch-next');
// memwatch.on('leak', (info:any) => {
//     console.error('Memory leak detected:\n', info);
//   });
// if (cluster.isMaster) {
//     cluster.fork()
// }
// let res = false;
// const s = Date.now();
// for (let i = 0; i < 1000000; i++) {
//     const exp = process.memoryUsage().heapUsed / 1024 / 1024 > 1000;
//     res = exp;
// }
// const e = Date.now();
// console.log(e - s)
// const s1 = Date.now();
// for (let i = 0; i < 1000000; i++) {
//     const exp = i % 1000 == -1;
//     res = exp;
// }
// const e1 = Date.now();

// console.log(e1 - s1)

const fswriteStream = fs.createWriteStream('dupa.txt');

class wrtie extends Writable {

    constructor(private filename: string) {
        super({ objectMode: true, highWaterMark: 3, });
    }

    count = 0;

    _write(chunk: any, encoding: any, done: any) {
        // this.buff = Buffer.concat([this.buff, Buffer.from(JSON.stringify(chunk))]);
        // // console.log(this.buff.length)
        // if (this.buff.byteLength > 1024 * 1024 * 100) {
        //     fs.writeFile(this.filename, this.buff, (err) => {
        //         if (err) {
        //             return console.log(err);
        //         }
        //         this.buff = Buffer.from('');
        //         console.log('writing to ', this.filename)
        //         done();
        //     });
        // } else {
        //     done();
        // }
        setTimeout(() => {
            console.log("wr", chunk)
            this.count++;
            done();
        })

    }

}

class read extends Readable {

    num = 0;

    constructor() {
        super({ objectMode: true, highWaterMark: 1 });

    }


    _read() {
        if (this.num == 5) {
            this.push(null)

        } else {
            this.push({id: this.num, name: "dupa" });
            this.num++;
        }

    }
}

class trans extends Transform {
    counter = 0;
    constructor() {
        super({ objectMode: true, highWaterMark: 3 });
    }
    _transform(chunk: any, encoding: any, done: any) {
        
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
w.count
const r = new read();
const r2 = new read();

const t = new trans()
r.pipe(t, {end: false}).pipe(w);
r2.pipe(t, {end: false})

// r2.pipe(new trans()).pipe(w2);