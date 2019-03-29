import { Readable, Writable, Transform } from "stream";
import { LineByLineReadableStream } from "./stream-impl/line-by-line-readable-stream";
import { JobContext } from "./types/job-context";
import { IJobDefinition } from "./types/job-definition";
import { WritableStreamWithStoreOffset } from "./stream-impl/writable-stream-with-store-offset";
import { TransformingStream } from "./stream-impl/transforming-stream";
import { BatchReadableStream } from "./stream-impl/batch-readable-stream";
var fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
var es = require('event-stream');

module BatchFileModule {
    class BatchFileJob implements IJobDefinition {
        readStr: Readable;
        constructor(context: JobContext) {
            //line-by-line path.join(context.workspaceDirectory, context.jobConfig.jobParams['to'])
            this.readStr = new BatchReadableStream(context);
        }

        timeout: any;

        beforeProcessing = (context: JobContext, done: () => void) => {
            console.log('beforeProcessing')
            done();
        };
        afterProcessing = (context: JobContext, done: () => void) => {
            console.log('afterProcessing')
            done();
        }

        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (context: JobContext) => this.readStr
            }
        };
        sinks = {
            s3: {
                //get: (context: JobContext) => <Writable>fs.createWriteStream(path.join(context.workspaceDirectory, context.jobConfig.jobParams['output']))
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context)
            }
        };
        transformers = {
            s2: {
                get: () => new TransformingStream()
            }
        };
        connections = [{
            from: 'sources1',
            to: {
                name: 's2',
                to: {
                    name: 's3'
                }
            }
        }];
        progress = () => {
            console.log('return progress', (this.readStr as BatchReadableStream).getProgress())
            return (this.readStr as BatchReadableStream).getProgress();
        }
    }


    module.exports.beforeCreate = (context: JobContext, done: () => void) => {
        console.log('beforeCreation');
        // fsPromises.copyFile(context.jobConfig.jobParams['from'], path.join(context.workspaceDirectory, context.jobConfig.jobParams['to']))
        //     .then(() => {
        //         console.log(`succces: ${context.jobConfig.jobParams['from']} was copied to ${path.join(context.workspaceDirectory, context.jobConfig.jobParams['to'])}`);
        //         done();
        //     })
        //     .catch(() => {
        //         console.log(`err: ${context.jobConfig.jobParams['from']} was not copied to ${path.join(context.workspaceDirectory, context.jobConfig.jobParams['to'])}`);
        //         done();
        //     });
        console.log('copy file by promise with done callback')
        done();
    }

    module.exports.default = (context: JobContext) => {
        console.log('default');
        return new BatchFileJob(context);
    }
    module.exports.afterDestroy = (context: JobContext) => new Promise(resolve => {
        console.log('afterDestroy');
        resolve();
    })
}