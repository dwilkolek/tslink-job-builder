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
            s3: {
                get: (context: JobContext) => new WritableStreamWithStoreOffset(context)
            }
        };
        transformers = {
            s2: {
                get: (context: JobContext) => new TransformingStream(context)
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
            return -1;
        }
    }

    module.exports.default = (context: JobContext) => {
        return new StreamingJob(context);
    }
}