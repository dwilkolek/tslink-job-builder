import { IJobDefinition } from "./types/job-definition";
import { Readable, Writable, Transform } from "stream";
import { Transformers } from "./transformers";
import { ContReadableStream } from "./cont-readable-stream";
import { JobContext } from "./types/job-context";

var fs = require('fs');
const path = require('path');

module StreamingJobModule {
    class StreamingJob implements IJobDefinition {


        constructor(context: JobContext) {

        }

        beforeProcessing = (context: JobContext, done: () => void) => {
            done();
        };
        afterProcessing = (context: JobContext, done: () => void) => {
            done();
        }

        keys: string[] = [];
        name = 'jobs1';
        sources = {
            sources1: {
                get: (context: JobContext) => new ContReadableStream()

            }
        };
        sinks = {
            s3: {
                get: (context: JobContext) => <Writable>fs.createWriteStream(path.join(context.workspaceDirectory, context.jobConfig.jobParams['output']))
            }
        };
        transformers = {
            s2: {
                get: () => new Transformers()
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
    }

    module.exports.default = (context: JobContext) => {
        return new StreamingJob(context);
    }
}