import { Readable } from "stream";
const fs = require('fs');

var es = require('event-stream');
export class LineByLineReadableStream extends Readable {

    lastLine: any = undefined;
    lineNr = 0;
    s: any = null;
    constructor(path: any) {
        super();
        const stats = fs.statSync(path)
        this.totalSize = stats.size;
        this.s = fs.createReadStream(path)
            .pipe(es.split())
            .pipe(es.mapSync((line: any) => {
                this.s.pause();
                this.lineNr += 1;
                this.lastLine = line;
                this.tolalRead += Buffer.from(line).byteLength;
                if (this.push(this.lastLine)) {
                    this.s.pause();
                }

            })
                .on('error', function (err: any) {
                    console.log('Error while reading file.', err);
                })
                .on('end', () => {
                    this.s.push(null);
                })
            );
    }

    private totalSize = 1;
    private tolalRead = 0;

    public getProgress() {
        return this.tolalRead/this.totalSize;
    }

    close() {
        this.s.close();
    }

    _read(size: number) {
        this.s.resume();
    }


}