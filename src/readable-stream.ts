import { Readable } from "stream";
const fs = require('fs');

var es = require('event-stream');
export class ReadableStream extends Readable {

    lastLine: any = undefined;
    lineNr = 0;
    s:any = null;
    constructor(path:any) {
        super();
        this.s = fs.createReadStream(path)
        .pipe(es.split())
        .pipe(es.mapSync((line: any) => {
            this.s.pause();
            this.lineNr += 1;
            this.lastLine = line;
            if (this.push(this.lastLine)) {
                this.s.pause();
            }
                
        })
            .on('error', function (err: any) {
                console.log('Error while reading file.', err);
            })
            .on('end', function () {
                console.log('Read entire file.')
            })
        );
    }
    

    _read(size: number) {
        this.s.resume();
    }


}