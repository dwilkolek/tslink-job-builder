import { Transform } from "stream";
export class Transformers extends Transform {

    _transform(chunk: any, encoding: string, done: import("stream").TransformCallback): void {
        setImmediate(() => {
            const obj = JSON.parse(chunk.toString());
            Object.keys(obj).forEach(k => {
                if (typeof obj[k] == 'string') {
                    obj[k] = obj[k] + " - transformed";
                }
                if (typeof obj[k] == 'number') {
                    obj[k] = obj[k]*100;
                }
                
            });
            let str = JSON.stringify(obj)+'\r\n';
            for (let i = 0; i< 10; i++) {
                str += str;
            }
            done(null, str);
            
        })
    }

}
