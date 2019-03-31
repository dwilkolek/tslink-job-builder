// import { ContinoiusReadableStream } from "./stream-impl/contious-readable-stream";
// import { TransformingStream } from "./stream-impl/transforming-stream";
// import { Writable, Readable, Transform } from "stream";

// class wrtie extends Writable {

//     constructor() {
//         super({ objectMode: true });

//     }


//     _write(chunk: any, encoding: any, done: any) {
//         console.log(chunk);
//         done();
//     }
// }

// class read extends Readable {

//     constructor() {
//         super({ objectMode: true });

//     }


//     _read() {
//         this.push({name:"dupa"})
//     }
// }

// class trans extends Transform {
//     constructor() {
//         super({ objectMode: true });
//     }
//     _transform(chunk: any, encoding: any, done: any) {
//         const copy = JSON.parse(JSON.stringify(chunk));
//         copy.name = copy.name + '1';
//         done(null, copy);
//     }
// }

// const w = new wrtie();
// const r = new read();
// r.pipe(new trans()).pipe(w);
// r.pipe(new trans()).pipe(w);