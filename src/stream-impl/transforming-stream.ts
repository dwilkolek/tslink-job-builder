import { Transform } from "stream";
import { JobContext } from "../types/job-context";
export class TransformingStream extends Transform {

    constructor(private context: JobContext) {
        super({ highWaterMark: 1, objectMode: context.jobConfig.objectMode })
    }

    _transform(chunk: any, encoding: string, done: import("stream").TransformCallback): void {
        console.log(chunk, this.context.jobConfig.objectMode)
        
        if (this.context.jobConfig.objectMode) {
            console.log( Object.keys(chunk));
            Object.keys(chunk).forEach(k => {
                if (typeof chunk[k] == 'string') {
                    chunk[k] = chunk[k] + " - transformed";
                }
                if (typeof chunk[k] == 'number') {
                    chunk[k] = chunk[k] + 1;
                }
            });
            console.log('transformed', chunk)
            done(null, chunk)
        } else {
            const lineschunk = chunk.toString();
            console.log('chunk ', chunk)
            console.log('chunk!', chunk.toString())
            const lines = lineschunk.split('\r\n');
            const end: string[] = [];
            lines.forEach((line: string) => {
                try {
                    const obj = JSON.parse(line);
                    Object.keys(obj).forEach(k => {
                        if (typeof obj[k] == 'string') {
                            obj[k] = obj[k] + " - transformed";
                        }
                        if (typeof obj[k] == 'number') {
                            obj[k] = obj[k] + 1;
                        }

                    });
                    console.log('transformed', line, '-->', obj)
                    end.push(obj);
                } catch (e) {

                }
            })

            let str = JSON.stringify(end.join('\r\n'));
            done(null, str);
        }
    }

}
