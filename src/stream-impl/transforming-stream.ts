import { Transform } from "stream";
export class TransformingStream extends Transform {

    constructor() {
        super({ highWaterMark: 1 })
    }

    _transform(chunk: any, encoding: string, done: import("stream").TransformCallback): void {
        const lineschunk = chunk.toString();
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
                end.push(JSON.stringify(obj));
            } catch (e) {

            }

        })

        let str = JSON.stringify(end.join('\r\n'));
        done(null, str);
    }

}
