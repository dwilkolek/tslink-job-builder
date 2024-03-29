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
        mainWriter: WritableStreamWithStoreOffset;
        constructor(context: JobContext) {
            //line-by-line path.join(context.workspaceDirectory, context.jobConfig.jobParams['to'])
            this.readStr = new BatchReadableStream(context);
            
            this.mainWriter = new WritableStreamWithStoreOffset(context, 500000)
        }

        timeout: any;
        progressCached = 0;
        beforeProcessing = (context: JobContext, done: () => void) => {
            console.log('beforeProcessing')
            done();
        };
        afterProcessing = (context: JobContext, done: () => void) => {
            console.log('afterProcessing')
            this.mainWriter.storeOffset(() => {
                done();
            })            
        }

        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (context: JobContext) => this.readStr
            }
        };
        sinks = {
            sink1: {
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context),
                readFrom: ['transformer1']
            },
            sink2: {
                get: (context: JobContext) => this.mainWriter,
                readFrom: ['transformer1', 'transformer2']
            },
            sink3: {
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context),
                readFrom: ['transformer2']
            }
        };
        transformers = {
            transformer1: {
                get: (context: JobContext) => new TransformingStream(context, true),
                readFrom: ['sources1']
            },
            transformer2: {
                get: (context: JobContext) => new TransformingStream(context, false),
                readFrom: ['sources1']
            }
        };
        // connections = [{
        //     from: 'sources1',
        //     to: [
        //         {
        //             name: 'transformer1',
        //             to: [{
        //                 name: 'sink1'
        //             }, {
        //                 name: 'sink2'
        //             }]
        //         },
        //         {
        //             name: 'transformer2',
        //             to: [{
        //                 name: 'sink2'
        //             }, {
        //                 name: 'sink3'
        //             }]
        //         }
        //     ]
        // }];
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
}