import { IJobDefinition } from "./types/job-definition";
import { Readable, Writable, Transform } from "stream";
import { ContinoiusReadableStream } from "./stream-impl/contious-readable-stream";
import { JobContext } from "./types/job-context";
import { WritableStreamWithStoreOffset } from "./stream-impl/writable-stream-with-store-offset";
import { TransformingStream } from "./stream-impl/transforming-stream";

var fs = require('fs');
const path = require('path');

module StreamingJobModule {

    class StreamingJob implements IJobDefinition {


        constructor(context: JobContext) {

        }

        beforeProcessing = (context: JobContext, done: () => void) => {
            console.log(`Starting from offset: ${context.currentOffset}`);
            done();
        };
        afterProcessing = (context: JobContext, done: () => void) => {
            done();
        }

        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (context: JobContext) => new ContinoiusReadableStream(context)
            }
        };
        sinks = {
            sink1: {
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context)
            },
            sink2: {
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context)
            },
            sink3: {
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context)
            }
        };
        transformers = {
            transformer1: {
                get: (context: JobContext) => new TransformingStream(context, true)
            },
            transformer2: {
                get: (context: JobContext) => new TransformingStream(context, false)
            }
        };
        // connections= [{
        //     from: 'sources1',
        //     to: [
        //         {

        //         }
        //     ]
        // }]
        connections = [{
            from: 'sources1',
            to: [
                {
                    name: 'transformer1',
                    to: [{
                        name: 'sink1'
                    }, {
                        name: 'sink2'
                    }]
                },
                {
                    name: 'transformer2',
                    to: [{
                        name: 'sink2'
                    }, {
                        name: 'sink3'
                    }]
                }
            ]
        }];
        progress = () => {
            return -1;
        }
    }

    module.exports.default = (context: JobContext) => {
        return new StreamingJob(context);
    }
}